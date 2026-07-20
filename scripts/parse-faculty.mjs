import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";
import { readProfessorSheet } from "./lib/read-professor-sheet.mjs";

// See scripts/parse-labs.mjs for why this reads
// "...대표연구추가.xlsx" (via lib/read-professor-sheet.mjs, not ExcelJS)
// instead of the older space-named workbook: same roster fields for every
// pre-existing professor, plus 이남규 (33rd professor, previously
// missing), plus corrected profile photos (a few rows in the older file
// had a representative-research figure pasted into the photo column by
// mistake, e.g. 김대은, 민경민).
const SRC = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교_기계공학부_교수진_대표연구추가.xlsx";
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

function isUrl(s) {
  return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

function isPlausibleEmail(s) {
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && (s.match(/@/g) || []).length === 1;
}

// Revised Romanization (via hangul-romanization) surname + "-" + given
// name, e.g. 강건욱 -> kang-geonuk. No official romanized names in the
// source data. NOTE: raw Korean-character slugs were tried first but hit
// a Unicode normalization (NFC/NFD) mismatch bug between
// generateStaticParams and the Next.js 16 Turbopack route matcher on this
// platform - ASCII slugs sidestep it.
function romanize(name) {
  const surname = name.slice(0, 1);
  const given = name.slice(1) || surname;
  return `${hangulRomanization.convert(surname)}-${hangulRomanization.convert(given)}`.toLowerCase();
}

function main() {
  const people = readProfessorSheet(SRC);

  const anomalies = [];
  const faculty = [];

  for (const p of people) {
    if (!p.name) {
      anomalies.push({ name: `(row ${p.startRow})`, field: "name", issue: "이름 없음 - 블록 스킵" });
      continue;
    }

    if (!Object.values(FIELD_MAP).includes(p.field)) {
      anomalies.push({ name: p.name, field: "researchField", issue: `알 수 없는 연구분야 값: "${p.field}"` });
    }

    let email = p.email;
    if (email && !isPlausibleEmail(email)) {
      anomalies.push({ name: p.name, field: "email", issue: `이메일 형식 이상: "${email}"` });
      email = null;
    }

    let phone = p.phone;
    if (phone && phone.trim().toUpperCase() === "X") {
      phone = null; // "X" = 전화번호 없음 (원본 표기 그대로 노출하지 않음)
    } else if (phone && !/^[0-9()\-+.\s]+$/.test(phone)) {
      anomalies.push({ name: p.name, field: "phone", issue: `전화번호 형식 이상: "${phone}"` });
      phone = null;
    }

    const labUrl = isUrl(p.labUrl) ? p.labUrl : null;
    if (p.labUrl && !labUrl) {
      anomalies.push({ name: p.name, field: "labUrl", issue: `URL 형식이 아님(무시): "${p.labUrl}"` });
    }

    faculty.push({
      name: p.name,
      // 직급 데이터가 없어 기본값으로 채움 - 실제 직급이 다르면 이 필드만 수정하면 됨
      position: "교수",
      field: p.field,
      email,
      phone,
      office: p.office || null,
      labName: p.labName || null,
      labUrl,
      photoPath: null, // filled in below
      _photo: p.photo,
    });
  }

  const slugCounts = new Map();
  for (const f of faculty) {
    const base = romanize(f.name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    f.slug = count === 0 ? base : `${base}-${count + 1}`;
  }
  const slugCollisions = [...slugCounts.entries()].filter(([, c]) => c > 1);

  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  let photoCount = 0;
  for (const f of faculty) {
    if (f._photo) {
      const safeName = f.name.replace(/[\\/:*?"<>|\s]/g, "");
      const fileName = `${safeName}.${f._photo.ext}`;
      fs.writeFileSync(path.join(PHOTO_DIR, fileName), f._photo.buffer);
      f.photoPath = `/assets/faculty/${fileName}`;
      photoCount++;
    }
  }

  // Match against labs.json (may be empty at this stage)
  let labs = [];
  try {
    labs = JSON.parse(fs.readFileSync(LABS_JSON, "utf-8"));
  } catch {
    labs = [];
  }
  const labsByName = new Map(labs.map((l) => [l.name, l]));
  const unmatchedWithLabs = [];
  for (const f of faculty) {
    const match = labsByName.get(f.name);
    f.labSlug = match ? match.slug : null;
    if (!match) unmatchedWithLabs.push(f.name);
  }

  const finalFaculty = faculty.map(({ _photo, ...rest }) => rest);
  fs.writeFileSync(OUT_JSON, JSON.stringify(finalFaculty, null, 2), "utf-8");

  const missingPhotos = faculty.filter((f) => !f.photoPath).map((f) => f.name);
  console.log("=== 파싱 리포트 ===");
  console.log(`정상 파싱: ${faculty.length}명`);
  console.log(`사진 추출: ${photoCount} / ${faculty.length}`);
  console.log(`사진 누락 인원: ${missingPhotos.length ? missingPhotos.join(", ") : "없음"}`);
  console.log(`\n연구분야 분포:`, Object.fromEntries(
    [...new Set(faculty.map((f) => f.field))].map((g) => [g, faculty.filter((f) => f.field === g).length])
  ));
  console.log(`\n이상값 처리 (${anomalies.length}건):`);
  anomalies.forEach((a) => console.log(`  - ${a.name} [${a.field}]: ${a.issue}`));
  console.log(`\nlabs.json 매칭 안 된 인원 (${unmatchedWithLabs.length}명):`, unmatchedWithLabs.join(", "));
  console.log(`\n슬러그 충돌 (${slugCollisions.length}건):`, slugCollisions.length ? slugCollisions.map(([n, c]) => `${n} (${c}회)`).join(", ") : "없음");
}

main();
