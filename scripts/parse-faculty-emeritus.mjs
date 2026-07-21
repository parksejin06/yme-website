import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";

// Source: 명예/퇴임 교수 roster. Single sheet, header row 2 (사진/이름/분야/년도/이메일/more information),
// one person per ~9-row block starting wherever column C has a name. Cross-checked against
// https://me.yonsei.ac.kr/me/faculty/professor_list.do (명예/퇴임 교수 tab): the official site
// also lists these 17 people as ONE undifferentiated group with no 명예 vs 퇴임 label per person,
// so we don't invent that distinction here either.
const SRC = "C:/Users/leees/OneDrive/바탕 화면/홈페이지 경진대회/연세대학교 기계공학부 명예,퇴임 교수진.xlsx";
const PHOTO_DIR = path.resolve("public/assets/faculty/emeritus");
const OUT_JSON = path.resolve("data/faculty-emeritus.json");

function romanize(name) {
  const surname = name.slice(0, 1);
  const given = name.slice(1) || surname;
  return `${hangulRomanization.convert(surname)}-${hangulRomanization.convert(given)}`.toLowerCase();
}

function cellText(row, col) {
  const cell = row.getCell(col);
  let v = cell.value;
  if (v && typeof v === "object" && "richText" in v) v = v.richText.map((t) => t.text).join("");
  else if (v && typeof v === "object" && "text" in v) v = v.text;
  return typeof v === "string" ? v.trim() || null : v ?? null;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SRC);
  const sheet = wb.worksheets[0];

  const people = [];
  for (let r = 3; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const name = cellText(row, 3);
    if (name) {
      people.push({
        row: r,
        name,
        field: cellText(row, 4),
        years: cellText(row, 5),
        email: cellText(row, 6),
      });
    }
  }

  const images = sheet.getImages().map((img) => ({
    tlRow: img.range.tl.nativeRow + 1,
    imageId: img.imageId,
  }));

  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const slugCounts = new Map();
  const anomalies = [];

  const finalPeople = people.map((p, i) => {
    const nextRow = people[i + 1]?.row ?? sheet.rowCount + 1;
    const img = images.find((im) => im.tlRow >= p.row - 2 && im.tlRow < nextRow);

    let photoPath = null;
    if (img) {
      const media = wb.model.media.find((m) => m.index === img.imageId);
      if (media) {
        const safeName = p.name.replace(/[\\/:*?"<>|\s]/g, "");
        const fileName = `${safeName}.${media.extension}`;
        fs.writeFileSync(path.join(PHOTO_DIR, fileName), media.buffer);
        photoPath = `/assets/faculty/emeritus/${fileName}`;
      }
    } else {
      anomalies.push({ name: p.name, issue: "사진 매칭 실패" });
    }

    const base = romanize(p.name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;

    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      anomalies.push({ name: p.name, issue: `이메일 형식 이상: "${p.email}"` });
      p.email = null;
    }

    return {
      name: p.name,
      nameEn: null,
      field: p.field,
      tenure: p.years,
      email: p.email,
      photoPath,
      slug,
    };
  });

  fs.writeFileSync(OUT_JSON, JSON.stringify(finalPeople, null, 2), "utf-8");

  console.log("=== 명예·퇴임 교수 파싱 리포트 ===");
  console.log(`총 인원: ${finalPeople.length}`);
  console.log(`사진 추출: ${finalPeople.filter((p) => p.photoPath).length} / ${finalPeople.length}`);
  console.log(`field 있음: ${finalPeople.filter((p) => p.field).length}, tenure 있음: ${finalPeople.filter((p) => p.tenure).length}, email 있음: ${finalPeople.filter((p) => p.email).length}`);
  console.log(`이상값 (${anomalies.length}건):`, anomalies);
}

main();
