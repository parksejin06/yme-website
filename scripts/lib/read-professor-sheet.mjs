import { readZip } from "./xlsx-lite.mjs";

// Reads the single-sheet professor roster workbook's cell data and embedded
// images directly from the xlsx's underlying XML parts. Column layout
// (A=field, D=name, E=email, F=phone, G row0/1/2=office/labName/labUrl,
// H=research title, I=research media) matches the sibling workbook that
// ExcelJS can load fine (연세대학교 기계공학부 교수진.xlsx) — this variant
// just has drawing relationships ExcelJS's reconcile step chokes on.
function decodeXmlEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function colLetterToNum(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n;
}

function parseSheetRows(sheetXml) {
  const rows = new Map(); // rowNum -> Map(colNum -> text)
  const rowRe = /<row r="(\d+)"[^>]*>(.*?)<\/row>/gs;
  let rm;
  while ((rm = rowRe.exec(sheetXml))) {
    const rowNum = parseInt(rm[1], 10);
    const cellMap = new Map();
    const cellRe = /<c r="([A-Z]+)(\d+)"[^>]*?(?:\/>|>(.*?)<\/c>)/gs;
    let cm;
    while ((cm = cellRe.exec(rm[2]))) {
      const inner = cm[3] || "";
      const tMatch = inner.match(/<t[^>]*>(.*?)<\/t>/s);
      const vMatch = inner.match(/<v>(.*?)<\/v>/s);
      const raw = tMatch ? tMatch[1] : vMatch ? vMatch[1] : null;
      if (raw != null) {
        const text = decodeXmlEntities(raw).trim();
        if (text !== "") cellMap.set(colLetterToNum(cm[1]), text);
      }
    }
    if (cellMap.size > 0) rows.set(rowNum, cellMap);
  }
  return rows;
}

function parseDrawingImages(drawingXml, relsXml, mediaGetFile) {
  const relMap = {};
  const relRe = /<Relationship\b[^>]*>/g;
  let rm;
  while ((rm = relRe.exec(relsXml))) {
    const idMatch = rm[0].match(/Id="(rId\d+)"/);
    const targetMatch = rm[0].match(/Target="([^"]+)"/);
    if (idMatch && targetMatch) relMap[idMatch[1]] = targetMatch[1];
  }

  const images = [];
  const anchorRe = /<twoCellAnchor[^>]*>(.*?)<\/twoCellAnchor>/gs;
  let am;
  while ((am = anchorRe.exec(drawingXml))) {
    const body = am[1];
    const fromMatch = body.match(/<from><col>(\d+)<\/col><colOff>-?\d+<\/colOff><row>(\d+)<\/row>/);
    const embedMatch = body.match(/r:embed="(rId\d+)"/);
    if (!fromMatch || !embedMatch) continue;
    const target = relMap[embedMatch[1]];
    if (!target) continue;
    const partName = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
    const buffer = mediaGetFile(partName);
    if (!buffer) continue;
    const ext = partName.split(".").pop() || "png";
    images.push({ row1: parseInt(fromMatch[2], 10) + 1, buffer, ext });
  }
  return images;
}

const FIELD_MAP = {
  "역학,소재": "역학·소재",
  "에너지,열유체": "에너지·열유체",
  "로보틱스,제어": "로보틱스·제어",
  "설계,제조": "설계·제조",
  "마이크로,나노": "마이크로·나노",
  "바이오,포토닉스": "바이오·포토닉스",
};

export function readProfessorSheet(filePath) {
  const zip = readZip(filePath);
  const sheetXml = zip.getFile("xl/worksheets/sheet1.xml").toString("utf-8");
  const rows = parseSheetRows(sheetXml);

  function cellText(rowNum, colNum) {
    return rows.get(rowNum)?.get(colNum) ?? null;
  }

  const maxRow = Math.max(...rows.keys());
  const blockStarts = [];
  for (let r = 2; r <= maxRow; r++) {
    if (cellText(r, 4)) blockStarts.push(r);
  }

  const people = [];
  for (let i = 0; i < blockStarts.length; i++) {
    const startRow = blockStarts[i];
    const endRow = i + 1 < blockStarts.length ? blockStarts[i + 1] - 1 : maxRow;
    const rawField = cellText(startRow, 1);
    people.push({
      field: FIELD_MAP[rawField] ?? rawField ?? null,
      name: cellText(startRow, 4),
      email: cellText(startRow, 5),
      phone: cellText(startRow, 6),
      office: cellText(startRow, 7),
      labName: cellText(startRow + 1, 7),
      labUrl: cellText(startRow + 2, 7),
      researchTitle: cellText(startRow, 8),
      researchMedia: cellText(startRow, 9),
      startRow,
      endRow,
    });
  }

  const drawingXml = zip.getFile("xl/drawings/drawing1.xml");
  const relsXml = zip.getFile("xl/drawings/_rels/drawing1.xml.rels");
  const images =
    drawingXml && relsXml
      ? parseDrawingImages(drawingXml.toString("utf-8"), relsXml.toString("utf-8"), (name) => zip.getFile(name))
      : [];

  for (const person of people) {
    const img = images.find((im) => im.row1 >= person.startRow && im.row1 <= person.endRow);
    person.photo = img ? { buffer: img.buffer, ext: img.ext } : null;
  }

  return people;
}
