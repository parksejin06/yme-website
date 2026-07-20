import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";

// Standalone parser for the "연구실·연구분야" (labs) page. Reads the same
// source workbook as parse-faculty.mjs but produces a different shape
// (per-professor lab entry grouped by research field, incl. representative
// research titles/media). Kept as its own script per explicit instruction:
// re-running this alone regenerates data/labs.json without touching
// data/faculty.json or its extracted photos.
const SRC = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교 기계공학부 교수진.xlsx";
const PHOTO_DIR = path.resolve("public/assets/faculty");
const OUT_JSON = path.resolve("data/labs.json");

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

function romanize(name) {
  const surname = name.slice(0, 1);
  const given = name.slice(1) || surname;
  return `${hangulRomanization.convert(surname)}-${hangulRomanization.convert(given)}`.toLowerCase();
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SRC);
  const ws = wb.worksheets[0];

  // 1. Block-start rows (col D has a name) => one per professor
  const blockStarts = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const name = cellText(ws.getRow(r).getCell(4));
    if (name) blockStarts.push(r);
  }

  const anomalies = [];
  const labs = [];

  for (let i = 0; i < blockStarts.length; i++) {
    const startRow = blockStarts[i];
    const endRow = i + 1 < blockStarts.length ? blockStarts[i + 1] - 1 : ws.rowCount;
    const row0 = ws.getRow(startRow);

    const name = cellText(row0.getCell(4));
    if (!name) {
      anomalies.push({ name: `(row ${startRow})`, field: "name", issue: "이름 없음 - 블록 스킵" });
      continue;
    }

    const rawField = cellText(row0.getCell(1));
    const field = FIELD_MAP[rawField] ?? rawField ?? null;
    if (!FIELD_MAP[rawField]) {
      anomalies.push({ name, field: "researchField", issue: `알 수 없는 연구분야 값: "${rawField}"` });
    }

    let email = cellText(row0.getCell(5));
    if (email && !isPlausibleEmail(email)) {
      anomalies.push({ name, field: "email", issue: `이메일 형식 이상: "${email}"` });
      email = null;
    }

    let phone = cellText(row0.getCell(6));
    if (phone && phone.trim().toUpperCase() === "X") {
      phone = null; // "X" = 전화번호 없음
    } else if (phone && !/^[0-9()\-+.\s]+$/.test(phone)) {
      anomalies.push({ name, field: "phone", issue: `전화번호 형식 이상: "${phone}"` });
      phone = null;
    }

    const office = cellText(row0.getCell(7));

    const row1 = ws.getRow(startRow + 1);
    const labNameEn = cellText(row1.getCell(7));

    const row2 = ws.getRow(startRow + 2);
    const labUrlCandidate = cellText(row2.getCell(7));
    const labUrl = isUrl(labUrlCandidate) ? labUrlCandidate : null;
    if (labUrlCandidate && !labUrl) {
      anomalies.push({ name, field: "labUrl", issue: `URL 형식이 아님(무시): "${labUrlCandidate}"` });
    }

    const rawTitles = cellText(row0.getCell(8));
    const researchTitles = rawTitles
      ? rawTitles.split("\n").map((t) => t.trim()).filter(Boolean)
      : [];

    let researchMediaUrl = cellText(row0.getCell(9));
    if (researchMediaUrl && !isUrl(researchMediaUrl)) {
      anomalies.push({ name, field: "researchMediaUrl", issue: `URL 형식이 아님(무시): "${researchMediaUrl}"` });
      researchMediaUrl = null;
    }

    labs.push({
      field,
      name,
      // 직급 데이터가 소스에 없어 기본값으로 채움 - 실제 직급이 다르면 이 필드만 수정
      position: "교수",
      email,
      phone,
      office: office || null,
      labNameEn: labNameEn || null,
      labUrl,
      researchTitles,
      researchMediaUrl,
      photoPath: null, // filled in after image extraction
      _startRow: startRow,
      _endRow: endRow,
    });
  }

  // 2. Slugs (same romanization scheme as parse-faculty.mjs, for stable keys /
  // potential cross-links to /faculty/[slug])
  const slugCounts = new Map();
  for (const l of labs) {
    const base = romanize(l.name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    l.slug = count === 0 ? base : `${base}-${count + 1}`;
  }

  // 3. Extract embedded professor photos, matched by anchor row
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const images = ws.getImages();
  const photoReport = { extracted: [], unmatched: [] };

  for (const img of images) {
    const anchorRow1 = img.range.tl.nativeRow + 1; // exceljs is 0-indexed
    const person = labs.find((l) => anchorRow1 >= l._startRow && anchorRow1 <= l._endRow);
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

  // 4. Write labs.json (strip internal bookkeeping fields)
  const finalLabs = labs.map(({ _startRow, _endRow, ...rest }) => rest);
  fs.writeFileSync(OUT_JSON, JSON.stringify(finalLabs, null, 2), "utf-8");

  // 5. Report
  const missingPhotos = labs.filter((l) => !l.photoPath).map((l) => l.name);
  const missingResearchMedia = labs.filter((l) => !l.researchMediaUrl).map((l) => l.name);
  console.log("=== 연구실 데이터 파싱 리포트 ===");
  console.log(`총 블록 발견: ${blockStarts.length}, 정상 파싱: ${labs.length}`);
  console.log(`사진 추출: ${photoReport.extracted.length} / ${images.length} (임베드 이미지 총 개수)`);
  console.log(`사진 누락 인원: ${missingPhotos.length ? missingPhotos.join(", ") : "없음"}`);
  console.log(`매칭 안 된 이미지(앵커 위치 불일치): ${photoReport.unmatched.length}`);
  console.log(`대표 연구 자료(URL) 누락 인원: ${missingResearchMedia.length}명 / ${labs.length}명 (fallback 처리 대상)`);
  console.log(`\n연구분야 분포:`, Object.fromEntries(
    [...new Set(labs.map((l) => l.field))].map((g) => [g, labs.filter((l) => l.field === g).length])
  ));
  console.log(`\n이상값 처리 (${anomalies.length}건):`);
  anomalies.forEach((a) => console.log(`  - ${a.name} [${a.field}]: ${a.issue}`));
}

main().catch((err) => {
  console.error("파싱 실패:", err);
  process.exit(1);
});
