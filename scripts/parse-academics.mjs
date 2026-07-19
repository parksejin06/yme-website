import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";

const GRAD_XLSX = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교_기계공학부_학번별_졸업요건.xlsx";
const COURSE_XLSX = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교_기계공학부_학부_교과목_소개.xlsx";

const OUT_GRAD = path.resolve("data/graduation-requirements.json");
const OUT_DUAL = path.resolve("data/dual-major.json");
const OUT_CURRICULUM = path.resolve("data/curriculum.json");
const OUT_COURSES = path.resolve("data/courses.json");

// ---------- helpers ----------

function cellText(cell) {
  const v = cell.value;
  if (v == null) return null;
  if (typeof v === "object" && typeof v.text === "string") return v.text;
  if (typeof v === "object" && v.richText) return v.richText.map((r) => r.text).join("");
  if (typeof v === "number") return v;
  return typeof v === "string" ? v.trim() : v;
}

function sheetRows(ws) {
  const headers = [];
  for (let c = 1; c <= ws.columnCount; c++) headers.push(cellText(ws.getRow(1).getCell(c)));
  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const obj = {};
    let hasData = false;
    for (let c = 1; c <= ws.columnCount; c++) {
      const val = cellText(row.getCell(c));
      obj[headers[c - 1]] = val;
      if (val != null && val !== "") hasData = true;
    }
    if (hasData) rows.push(obj);
  }
  return rows;
}

function normalize(v) {
  if (v === "-" || v === "none" || v === "" || v == null) return null;
  return v;
}

function splitList(v) {
  if (!v || v === "-") return [];
  return v.split(";").map((s) => s.trim()).filter(Boolean);
}

// Sentences containing these markers are admin-only (data-quality caveats),
// never shown to students per task spec.
const ADMIN_ONLY_MARKERS = ["확인 필요", "불일치"];

function splitPublicAndAdminNotes(text) {
  if (!text || text === "-") return { publicNote: null, adminNotes: [] };
  const sentences = text.split(/(?<=[.])\s+/).map((s) => s.trim()).filter(Boolean);
  const publicSentences = [];
  const adminNotes = [];
  for (const s of sentences) {
    if (ADMIN_ONLY_MARKERS.some((m) => s.includes(m))) adminNotes.push(s);
    else publicSentences.push(s);
  }
  return { publicNote: publicSentences.join(" ") || null, adminNotes };
}

// ---------- student-year group metadata ----------

const STUDENT_GROUPS = [
  { studentYear: "03-05", label: "03~05학번", decade: "2000s", min: 3, max: 5 },
  { studentYear: "06-09", label: "06~09학번", decade: "2000s", min: 6, max: 9 },
  { studentYear: "10-12", label: "10~12학번", decade: "2010s", min: 10, max: 12 },
  { studentYear: "13-14", label: "13~14학번", decade: "2010s", min: 13, max: 14 },
  { studentYear: "15-17", label: "15~17학번", decade: "2010s", min: 15, max: 17 },
  { studentYear: "18", label: "18학번", decade: "2010s", min: 18, max: 18 },
  { studentYear: "19", label: "19학번", decade: "2010s", min: 19, max: 19 },
  { studentYear: "20", label: "20학번", decade: "2020s", min: 20, max: 20 },
  { studentYear: "21", label: "21학번", decade: "2020s", min: 21, max: 21 },
  { studentYear: "22", label: "22학번", decade: "2020s", min: 22, max: 22 },
  { studentYear: "23", label: "23학번", decade: "2020s", min: 23, max: 23 },
  { studentYear: "24", label: "24학번", decade: "2020s", min: 24, max: 24 },
  { studentYear: "25", label: "25학번", decade: "2020s", min: 25, max: 25 },
  { studentYear: "transfer_admission", slug: "transfer-admission", label: "학사편입", decade: "other", min: null, max: null },
  { studentYear: "expected_double_major", slug: "expected-double-major", label: "졸업예정자 복수전공", decade: "other", min: null, max: null },
];

function slugFor(g) {
  return g.slug ?? g.studentYear;
}

// Parse a free-text "적용 학번" clause into either a [min,max] year range,
// the literal string "all" (applies everywhere), or a special-group key.
function parseClause(clause) {
  clause = clause.trim();
  if (clause.startsWith("전체")) return { type: "all" };
  if (clause.includes("학사편입")) return { type: "special", key: "transfer_admission" };
  if (clause.includes("졸업예정자")) return { type: "special", key: "expected_double_major" };

  let m = clause.match(/^(\d{2})\s*~\s*(\d{2})학번$/) || clause.match(/^(\d{2})학번\s*~\s*(\d{2})학번$/);
  if (m) return { type: "range", min: Number(m[1]), max: Number(m[2]) };

  m = clause.match(/^(\d{2})학번\s*이후$/);
  if (m) return { type: "range", min: Number(m[1]), max: 99 };

  m = clause.match(/^(\d{2})학번\s*이전$/);
  if (m) return { type: "range", min: 0, max: Number(m[1]) };

  m = clause.match(/^(\d{2})학번(\s*\(.*\))?$/) || clause.match(/^(\d{2})학번\s*포함\s*이후$/);
  if (m) return { type: "range", min: Number(m[1]), max: Number(m[1]) };

  m = clause.match(/^(\d{2})학번\s*포함\s*이전$/);
  if (m) return { type: "range", min: 0, max: Number(m[1]) };

  return { type: "unrecognized" };
}

// Returns the set of STUDENT_GROUPS.studentYear values a note's "적용 학번"
// field applies to, by range overlap (not exact match - the note sheet uses
// finer-grained year boundaries than our display groups in some cases).
function matchGroups(appliesTo) {
  const clauses = appliesTo.split("/").map((s) => s.trim());
  const matched = new Set();
  let anyUnrecognized = false;
  for (const clause of clauses) {
    const parsed = parseClause(clause);
    if (parsed.type === "all") {
      STUDENT_GROUPS.forEach((g) => matched.add(g.studentYear));
    } else if (parsed.type === "special") {
      matched.add(parsed.key);
    } else if (parsed.type === "range") {
      for (const g of STUDENT_GROUPS) {
        if (g.min == null) continue; // special groups excluded from numeric overlap
        if (!(parsed.max < g.min || parsed.min > g.max)) matched.add(g.studentYear);
      }
    } else {
      anyUnrecognized = true;
    }
  }
  return { matched: [...matched], anyUnrecognized };
}

// ---------- main ----------

async function main() {
  const gradWb = new ExcelJS.Workbook();
  await gradWb.xlsx.readFile(GRAD_XLSX);
  const courseWb = new ExcelJS.Workbook();
  await courseWb.xlsx.readFile(COURSE_XLSX);

  const report = { adminNotes: {}, unmatchedSpecialNotes: [], flags: [] };

  // --- 1. graduation-requirements.json ---
  const websiteRows = sheetRows(gradWb.getWorksheet("웹사이트용 데이터"));
  const specialNoteRows = sheetRows(gradWb.getWorksheet("학번별 특이사항 및 예외"));

  const gradEntries = websiteRows.map((row) => {
    const g = STUDENT_GROUPS.find(
      (x) =>
        x.studentYear === row.student_year ||
        (row.student_year === "all" && typeof row.major_type === "string" && row.major_type.startsWith(x.studentYear))
    );
    if (!g) {
      report.flags.push(`웹사이트용 데이터 행의 student_year="${row.student_year}" / major_type="${row.major_type}"에 매칭되는 그룹 없음`);
    }
    const { publicNote, adminNotes } = splitPublicAndAdminNotes(row.notes);
    if (adminNotes.length) report.adminNotes[g ? g.studentYear : row.student_year] = adminNotes;

    return {
      studentYear: g ? g.studentYear : row.student_year,
      slug: g ? slugFor(g) : row.student_year,
      label: g ? g.label : row.student_year,
      decade: g ? g.decade : "other",
      majorType: row.major_type,
      summary: {
        liberalArtsBasic: normalize(row.liberal_arts_basic),
        universityLiberalElective: normalize(row.university_liberal_elective),
        universityLiberalRequired: normalize(row.university_liberal_required),
        basicEducation: normalize(row.basic_education),
        majorBasic: normalize(row.major_basic),
        majorRequired: normalize(row.major_required),
        majorElective: normalize(row.major_elective),
        majorTotal: normalize(row.major_total),
        graduationTotal: normalize(row.graduation_total),
        upperLevelCredit: normalize(row.upper_level_credit),
        designCredit: normalize(row.design_credit),
        rcRequirement: normalize(row.rc_requirement),
        chapelRequirement: normalize(row.chapel_requirement),
      },
      mandatoryCourses: splitList(row.mandatory_courses),
      note: publicNote,
      specialNotes: [],
    };
  });

  // Single-clause "X학번 이후" notes carry an implicit recency: a later rule
  // for the same category supersedes an earlier one for any group both apply
  // to (this is confirmed in the source data itself, e.g. row 28's 비고 says
  // "22학번 이후 규정으로 대체"). sortKey captures that recency; multi-clause
  // or non-open-ended notes get sortKey=null and are never treated as superseded.
  function openEndedSortKey(appliesTo) {
    const m = appliesTo.trim().match(/^(\d{2})학번\s*이후$/);
    return m ? Number(m[1]) : null;
  }

  // attach special notes (item c) via range-overlap matching
  let supersededCount = 0;
  for (const noteRow of specialNoteRows) {
    const { matched, anyUnrecognized } = matchGroups(noteRow["적용 학번"]);
    if (anyUnrecognized || matched.length === 0) {
      report.unmatchedSpecialNotes.push({ appliesTo: noteRow["적용 학번"], content: noteRow["내용"] });
      continue;
    }
    const sortKey = openEndedSortKey(noteRow["적용 학번"]);
    for (const studentYear of matched) {
      const entry = gradEntries.find((e) => e.studentYear === studentYear);
      if (entry) {
        entry.specialNotes.push({
          category: noteRow["구분"],
          content: noteRow["내용"],
          importance: noteRow["중요도"],
          _sortKey: sortKey,
        });
      }
    }
  }

  // Resolve same-category conflicts per group: keep only the most recent
  // open-ended rule (highest sortKey), and drop exact-duplicate content.
  for (const entry of gradEntries) {
    const byCategory = new Map();
    for (const note of entry.specialNotes) {
      if (!byCategory.has(note.category)) byCategory.set(note.category, []);
      byCategory.get(note.category).push(note);
    }
    const resolved = [];
    for (const notes of byCategory.values()) {
      const withKey = notes.filter((n) => n._sortKey != null);
      const withoutKey = notes.filter((n) => n._sortKey == null);
      let keep = withoutKey;
      if (withKey.length > 0) {
        const maxKey = Math.max(...withKey.map((n) => n._sortKey));
        const seenContent = new Set();
        for (const n of withKey) {
          if (n._sortKey !== maxKey) {
            supersededCount++;
            continue;
          }
          if (seenContent.has(n.content)) continue; // literal duplicate at same recency
          seenContent.add(n.content);
          keep.push(n);
        }
      }
      resolved.push(...keep);
    }
    entry.specialNotes = resolved.map(({ _sortKey, ...rest }) => rest);
  }

  fs.writeFileSync(OUT_GRAD, JSON.stringify(gradEntries, null, 2), "utf-8");

  // --- 2. dual-major.json (common info, not per-year) ---
  const dualRows = sheetRows(gradWb.getWorksheet("복수전공·부전공")).map((row) => ({
    appliesTo: row["적용 학번"],
    category: row["구분"],
    majorRequiredCredit: normalize(row["전공필수 학점"]),
    majorElectiveCredit: normalize(row["전공선택 학점"]),
    majorTotalCredit: normalize(row["총 전공학점"]),
    requiredCourses: normalize(row["필수 이수과목"]),
    otherConditions: normalize(row["기타 조건"]),
  }));
  fs.writeFileSync(OUT_DUAL, JSON.stringify(dualRows, null, 2), "utf-8");

  // --- 3. curriculum.json (grid) ---
  const curriculumRows = sheetRows(courseWb.getWorksheet("교과목 체계도용 데이터"));
  const curriculumEntries = [];
  const excludedFromGrid = [];

  for (const row of curriculumRows) {
    const year = row.year;
    const semester = row.semester;
    let buckets = [];
    if (year === "1" && (semester === "1" || semester === "2")) buckets = [`1-${semester}`];
    else if (year === "2" && (semester === "1" || semester === "2")) buckets = [`2-${semester}`];
    else if (year === "3·4" && (semester === "1" || semester === "2")) buckets = [`34-${semester}`];
    else if (year === "4" && (semester === "1" || semester === "2")) buckets = [`4-${semester}`];
    else if (year === "4" && semester === "1·2") buckets = ["4-1", "4-2"]; // spans both semesters

    if (buckets.length === 0) {
      excludedFromGrid.push({ code: row.course_code, name: row.course_name_ko, year, semester });
      continue;
    }

    if (row.course_code === "MEU2300") {
      report.flags.push(
        "커리큘럼표와 졸업요건 특이사항 간 기계공학창의설계 전공필수 여부 불일치, 원본 확인 필요 " +
          "(교과목 체계도용 데이터: course_type=전필 / 졸업요건 24-25학번 mandatory_courses 목록에는 미포함, " +
          "특이사항 시트: '24학번부터 전공필수 과목에서 기계공학창의설계가 제외됨')"
      );
    }

    for (const bucket of buckets) {
      curriculumEntries.push({
        courseId: row.course_id,
        courseCode: row.course_code,
        nameKr: row.course_name_ko,
        nameEn: row.course_name_en,
        bucket,
        spansBothSemesters: buckets.length > 1,
        courseType: row.course_type,
        credit: row.credit,
        lectureHours: row.lecture_hours,
        practiceHours: row.practice_hours,
        category: row.category,
        researchArea: normalize(row.research_area),
        displayOrder: row.display_order,
        dataNote: normalize(row.notes),
      });
    }
  }
  curriculumEntries.sort((a, b) => a.displayOrder - b.displayOrder);
  fs.writeFileSync(OUT_CURRICULUM, JSON.stringify(curriculumEntries, null, 2), "utf-8");

  // --- 4. courses.json (detail lookup) ---
  const detailRows = sheetRows(courseWb.getWorksheet("교과목 상세페이지용 데이터"));
  const NO_DETAIL_PHRASE = "학부 교과목소개 페이지에 별도 상세설명 없음";
  let noDetailCount = 0;
  const courseEntries = detailRows.map((row) => {
    const hasNoDetail = typeof row["상세설명"] === "string" && row["상세설명"].includes(NO_DETAIL_PHRASE);
    if (hasNoDetail) noDetailCount++;
    return {
      courseCode: row["학정번호"],
      nameKr: row["교과목명"],
      nameEn: normalize(row["영문명"]),
      courseType: row["종별"],
      credit: row["학점"],
      year: row["학년"],
      semester: row["학기"],
      lectureHours: row["강의시간"],
      practiceHours: row["실습시간"],
      description: hasNoDetail ? null : row["상세설명"],
      hasDetail: !hasNoDetail,
      keywords: normalize(row["핵심 키워드"]),
      researchArea: normalize(row["연구분야"]),
      relatedCourses: normalize(row["관련 교과목"]),
      note: normalize(row["비고"]),
    };
  });
  fs.writeFileSync(OUT_COURSES, JSON.stringify(courseEntries, null, 2), "utf-8");

  // cross-check curriculum <-> courses code sets
  const curriculumCodes = new Set(curriculumEntries.map((c) => c.courseCode));
  const courseCodes = new Set(courseEntries.map((c) => c.courseCode));
  const onlyInCurriculum = [...curriculumCodes].filter((c) => !courseCodes.has(c));
  const onlyInCourses = [...courseCodes].filter((c) => !curriculumCodes.has(c));

  // ---------- report ----------
  console.log("=== 학부 교육과정 파싱 리포트 ===\n");
  console.log(`학번 그룹: 총 ${STUDENT_GROUPS.length}개 중 ${gradEntries.length}개 정상 파싱`);
  console.log(gradEntries.map((e) => e.slug).join(", "));

  console.log(`\n동일 구분 내 이전 규정으로 대체(superseded)되어 제외한 특이사항: ${supersededCount}건`);

  console.log(`\n특이사항 매칭 실패/미인식 (${report.unmatchedSpecialNotes.length}건):`);
  report.unmatchedSpecialNotes.forEach((n) => console.log(`  - [${n.appliesTo}] ${n.content}`));

  console.log(`\n관리자 전용 노트로 분리된 항목 (${Object.keys(report.adminNotes).length}개 그룹):`);
  for (const [year, notes] of Object.entries(report.adminNotes)) {
    notes.forEach((n) => console.log(`  - [${year}] ${n}`));
  }

  console.log(`\n플래그 (${report.flags.length}건):`);
  report.flags.forEach((f) => console.log(`  - ${f}`));

  console.log(`\n그리드 배치 불가 과목 (${excludedFromGrid.length}개, year/semester 값이 유효하지 않음):`);
  excludedFromGrid.forEach((c) => console.log(`  - ${c.code} ${c.name} (year="${c.year}", semester="${c.semester}")`));

  console.log(`\n상세설명 없음("${NO_DETAIL_PHRASE}") 과목: ${noDetailCount} / ${courseEntries.length}개`);

  console.log(`\ncurriculum에만 있고 courses에 없는 과목코드 (${onlyInCurriculum.length}):`, onlyInCurriculum.join(", ") || "없음");
  console.log(`courses에만 있고 curriculum에 없는 과목코드 (${onlyInCourses.length}):`, onlyInCourses.join(", ") || "없음");
}

main().catch((err) => {
  console.error("파싱 실패:", err);
  process.exit(1);
});
