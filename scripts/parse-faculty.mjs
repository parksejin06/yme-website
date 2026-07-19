import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";

const SRC = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교 기계공학부 교수진.xlsx";
const PHOTO_DIR = path.resolve("public/assets/faculty");
const LABS_JSON = path.resolve("data/labs.json");
const OUT_JSON = path.resolve("data/faculty.json");

const FIELD_MAP = {
  "역학,소재": "역학·소재",
  "에너지,열유체": "에너지·열유체",
  "로보틱스,제어": "로보틱스·제어",
  "설계,제조": "설계·제조",
  "마이크로,나노": "마이크로·나노",
  "바이오,포토닉스": "바이오·포토닉스",
};

function cellText(cell) {
  const v = cell.value;
  if (v == null) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    if (typeof v.text === "string") return v.text.trim() || null; // hyperlink cell
    if (typeof v.richText === "object") return v.richText.map((r) => r.text).join("").trim() || null;
  }
  return String(v).trim() || null;
}

function isUrl(s) {
  return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

function isPlausibleEmail(s) {
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && (s.match(/@/g) || []).length === 1;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SRC);
  const ws = wb.worksheets[0];

  // 1. Find block-start rows (column D has a value) => one per professor
  const blockStarts = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const name = cellText(ws.getRow(r).getCell(4));
    if (name) blockStarts.push(r);
  }

  const anomalies = [];
  const faculty = [];

  for (let i = 0; i < blockStarts.length; i++) {
    const startRow = blockStarts[i];
    const row0 = ws.getRow(startRow);

    const rawField = cellText(row0.getCell(1));
    const field = FIELD_MAP[rawField] ?? rawField ?? null;
    if (!FIELD_MAP[rawField]) {
      anomalies.push({ name: cellText(row0.getCell(4)), field: "researchField", issue: `알 수 없는 연구분야 값: "${rawField}"` });
    }

    const name = cellText(row0.getCell(4));

    let email = cellText(row0.getCell(5));
    if (email && !isPlausibleEmail(email)) {
      anomalies.push({ name, field: "email", issue: `이메일 형식 이상: "${email}"` });
      email = null;
    }

    let phone = cellText(row0.getCell(6));
    if (phone && phone.trim().toUpperCase() === "X") {
      phone = null; // "X" = 전화번호 없음 (원본 표기 그대로 노출하지 않음)
    } else if (phone && !/^[0-9()\-+.\s]+$/.test(phone)) {
      anomalies.push({ name, field: "phone", issue: `전화번호 형식 이상: "${phone}"` });
      phone = null;
    }

    const office = cellText(row0.getCell(7));

    const row1 = ws.getRow(startRow + 1);
    const labName = cellText(row1.getCell(7));

    const row2 = ws.getRow(startRow + 2);
    const labUrlCandidate = cellText(row2.getCell(7));
    const labUrl = isUrl(labUrlCandidate) ? labUrlCandidate : null;
    if (labUrlCandidate && !labUrl) {
      anomalies.push({ name, field: "labUrl", issue: `URL 형식이 아님(무시): "${labUrlCandidate}"` });
    }

    if (!name) {
      anomalies.push({ name: `(row ${startRow})`, field: "name", issue: "이름 없음 - 블록 스킵" });
      continue;
    }

    faculty.push({
      name,
      // 직급 데이터가 없어 기본값으로 채움 - 실제 직급이 다르면 이 필드만 수정하면 됨
      position: "교수",
      field,
      email,
      phone,
      office: office || null,
      labName: labName || null,
      labUrl,
      photoPath: null, // filled in after image extraction
      _startRow: startRow,
      _endRow: i + 1 < blockStarts.length ? blockStarts[i + 1] - 1 : ws.rowCount,
    });
  }

  // 1b. Slugs for /faculty/[slug]. No official romanized names in the source
  // data, so we algorithmically romanize (Revised Romanization, via
  // hangul-romanization) surname + "-" + given-name, e.g. 강건욱 -> kang-geonuk.
  // NOTE: raw Korean-character slugs were tried first but hit a Unicode
  // normalization (NFC/NFD) mismatch bug between generateStaticParams and the
  // Next.js 16 Turbopack route matcher on this platform - ASCII slugs sidestep it.
  function romanize(name) {
    const surname = name.slice(0, 1);
    const given = name.slice(1) || surname;
    return `${hangulRomanization.convert(surname)}-${hangulRomanization.convert(given)}`.toLowerCase();
  }
  const slugCounts = new Map();
  for (const f of faculty) {
    const base = romanize(f.name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    f.slug = count === 0 ? base : `${base}-${count + 1}`;
  }
  const slugCollisions = [...slugCounts.entries()].filter(([, c]) => c > 1);

  // 2. Extract embedded images, matched to professor by anchor row
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const images = ws.getImages();
  const photoReport = { extracted: [], unmatched: [] };

  for (const img of images) {
    const anchorRow1 = img.range.tl.nativeRow + 1; // exceljs is 0-indexed
    const person = faculty.find((f) => anchorRow1 >= f._startRow && anchorRow1 <= f._endRow);
    const media = wb.model.media[img.imageId];
    if (!media) continue;
    const ext = media.extension || "png";

    if (!person) {
      photoReport.unmatched.push({ imageId: img.imageId, anchorRow1 });
      continue;
    }
    const safeName = person.name.replace(/[\\/:*?"<>|\s]/g, "");
    const fileName = `${safeName}.${ext}`;
    fs.writeFileSync(path.join(PHOTO_DIR, fileName), media.buffer);
    person.photoPath = `/assets/faculty/${fileName}`;
    photoReport.extracted.push(person.name);
  }

  // 3. Match against labs.json (may be empty at this stage)
  let labs = [];
  try {
    labs = JSON.parse(fs.readFileSync(LABS_JSON, "utf-8"));
  } catch {
    labs = [];
  }
  const labNamesByProfessor = new Map(labs.map((l) => [l.professorKr, l]));
  const unmatchedWithLabs = [];
  for (const f of faculty) {
    const match = labNamesByProfessor.get(f.name);
    f.labSlug = match ? match.slug : null;
    if (!match) unmatchedWithLabs.push(f.name);
  }

  // 4. Write faculty.json (strip internal bookkeeping fields)
  const finalFaculty = faculty.map(({ _startRow, _endRow, ...rest }) => rest);
  fs.writeFileSync(OUT_JSON, JSON.stringify(finalFaculty, null, 2), "utf-8");

  // 5. Report
  const missingPhotos = faculty.filter((f) => !f.photoPath).map((f) => f.name);
  console.log("=== 파싱 리포트 ===");
  console.log(`총 블록 발견: ${blockStarts.length}, 정상 파싱: ${faculty.length}`);
  console.log(`사진 추출: ${photoReport.extracted.length} / ${images.length} (임베드 이미지 총 개수)`);
  console.log(`사진 누락 인원: ${missingPhotos.length ? missingPhotos.join(", ") : "없음"}`);
  console.log(`매칭 안 된 이미지(앵커 위치 불일치): ${photoReport.unmatched.length}`);
  console.log(`\n연구분야 분포:`, Object.fromEntries(
    [...new Set(faculty.map((f) => f.field))].map((g) => [g, faculty.filter((f) => f.field === g).length])
  ));
  console.log(`\n이상값 처리 (${anomalies.length}건):`);
  anomalies.forEach((a) => console.log(`  - ${a.name} [${a.field}]: ${a.issue}`));
  console.log(`\nlabs.json 매칭 안 된 인원 (${unmatchedWithLabs.length}명):`, unmatchedWithLabs.join(", "));
  console.log(`\n슬러그 충돌 (${slugCollisions.length}건):`, slugCollisions.length ? slugCollisions.map(([n, c]) => `${n} (${c}회)`).join(", ") : "없음");
}

main().catch((err) => {
  console.error("파싱 실패:", err);
  process.exit(1);
});
