import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";
import { readProfessorSheet } from "./lib/read-professor-sheet.mjs";

// Standalone parser for the "연구실·연구분야" (labs) page. Reads the
// "...대표연구추가.xlsx" workbook - re-running this alone regenerates
// data/labs.json without touching data/faculty.json or its extracted
// photos.
//
// This workbook supersedes the older space-named
// "연세대학교 기계공학부 교수진.xlsx": same roster fields for all
// pre-existing professors (verified 1:1, field-by-field) plus a 33rd
// professor (이남규, absent from the older file), a "대표 연구 제목"
// filled in for every row (the older file only had it for a handful, and
// has since been cleared entirely upstream), and - importantly - a
// verified real face photo in the profile-photo column for every row.
// The older file had a few rows (e.g. 김대은, 민경민) where someone had
// pasted a representative-research figure into the profile-photo column
// by mistake; this workbook fixes that.
//
// ExcelJS cannot load this workbook (its drawing relationships trip a bug
// in ExcelJS's drawing-reconcile step: "Cannot read properties of
// undefined (reading 'anchors')"), so it's read via lib/xlsx-lite.mjs
// (a small dependency-free ZIP/XML reader) instead of ExcelJS.
const SRC = "c:\\Users\\parks\\OneDrive\\Desktop\\홈페이지 경진대회\\reference\\연세대학교_기계공학부_교수진_대표연구추가.xlsx";
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

function main() {
  const people = readProfessorSheet(SRC);

  const anomalies = [];
  const labs = [];

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
      phone = null; // "X" = 전화번호 없음
    } else if (phone && !/^[0-9()\-+.\s]+$/.test(phone)) {
      anomalies.push({ name: p.name, field: "phone", issue: `전화번호 형식 이상: "${phone}"` });
      phone = null;
    }

    const labUrl = isUrl(p.labUrl) ? p.labUrl : null;
    if (p.labUrl && !labUrl) {
      anomalies.push({ name: p.name, field: "labUrl", issue: `URL 형식이 아님(무시): "${p.labUrl}"` });
    }

    const researchTitles = p.researchTitle ? [p.researchTitle] : [];

    const researchMediaUrl = isUrl(p.researchMedia) ? p.researchMedia : null;
    if (p.researchMedia && !researchMediaUrl) {
      anomalies.push({ name: p.name, field: "researchMediaUrl", issue: `URL 형식이 아님(무시): "${p.researchMedia}"` });
    }

    labs.push({
      field: p.field,
      name: p.name,
      // 직급 데이터가 소스에 없어 기본값으로 채움 - 실제 직급이 다르면 이 필드만 수정
      position: "교수",
      email,
      phone,
      office: p.office || null,
      labNameEn: p.labName || null,
      labUrl,
      researchTitles,
      researchMediaUrl,
      photoPath: null, // filled in below
      _photo: p.photo,
    });
  }

  // Slugs (Revised Romanization via hangul-romanization) for stable keys /
  // potential cross-links to /faculty/[slug].
  const slugCounts = new Map();
  for (const l of labs) {
    const base = romanize(l.name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    l.slug = count === 0 ? base : `${base}-${count + 1}`;
  }

  // Write embedded profile photos.
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  let photoCount = 0;
  for (const l of labs) {
    if (l._photo) {
      const safeName = l.name.replace(/[\\/:*?"<>|\s]/g, "");
      const fileName = `${safeName}.${l._photo.ext}`;
      fs.writeFileSync(path.join(PHOTO_DIR, fileName), l._photo.buffer);
      l.photoPath = `/assets/faculty/${fileName}`;
      photoCount++;
    }
  }

  const finalLabs = labs.map(({ _photo, ...rest }) => rest);
  fs.writeFileSync(OUT_JSON, JSON.stringify(finalLabs, null, 2), "utf-8");

  const missingPhotos = labs.filter((l) => !l.photoPath).map((l) => l.name);
  const missingTitles = labs.filter((l) => l.researchTitles.length === 0).map((l) => l.name);
  const missingResearchMedia = labs.filter((l) => !l.researchMediaUrl).length;
  console.log("=== 연구실 데이터 파싱 리포트 ===");
  console.log(`정상 파싱: ${labs.length}명`);
  console.log(`사진 추출: ${photoCount} / ${labs.length}`);
  console.log(`사진 누락 인원: ${missingPhotos.length ? missingPhotos.join(", ") : "없음"}`);
  console.log(`대표 연구 제목 누락 인원: ${missingTitles.length ? missingTitles.join(", ") : "없음"}`);
  console.log(`대표 연구 자료(URL) 누락 인원: ${missingResearchMedia}명 / ${labs.length}명 (fallback 처리 대상)`);
  console.log(`\n연구분야 분포:`, Object.fromEntries(
    [...new Set(labs.map((l) => l.field))].map((g) => [g, labs.filter((l) => l.field === g).length])
  ));
  console.log(`\n이상값 처리 (${anomalies.length}건):`);
  anomalies.forEach((a) => console.log(`  - ${a.name} [${a.field}]: ${a.issue}`));
}

main();
