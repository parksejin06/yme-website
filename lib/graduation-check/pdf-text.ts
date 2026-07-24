import * as pdfjsLib from "pdfjs-dist";

interface TextItemLike {
  str: string;
  transform: number[];
  width: number;
  height: number;
}

// The worker is created with `new Worker(new URL(...))` (the pattern Turbopack/
// webpack bundle reliably) rather than a workerSrc string, and only when a file
// is first parsed. Everything runs in the browser — the PDF never leaves it.
let workerReady = false;
function ensureWorker() {
  if (workerReady) return;
  const worker = new Worker(new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url), {
    type: "module",
  });
  pdfjsLib.GlobalWorkerOptions.workerPort = worker;
  workerReady = true;
}

/**
 * Reconstructs one visual row's text from positioned glyphs. Transcript PDFs
 * place each character as its own text item, so joining with plain spaces
 * would split every word ("대 교", "A I C 2 1 1 0"). Instead we insert a space
 * only where there's a real horizontal gap between items (a column break),
 * concatenating tightly-packed glyphs within a cell.
 */
function rowText(items: TextItemLike[]): string {
  const sorted = [...items].sort((a, b) => a.transform[4] - b.transform[4]);
  let line = "";
  let prevRight: number | null = null;
  let prevFont = 10;
  for (const it of sorted) {
    const x = it.transform[4];
    const font = Math.abs(it.transform[0]) || it.height || prevFont;
    if (prevRight !== null && x - prevRight > 0.3 * font) line += " ";
    line += it.str;
    prevRight = x + it.width;
    prevFont = font;
  }
  return line.replace(/\s+/g, " ").trim();
}

/**
 * Extracts text from a transcript PDF (the portal's 출력 → "PDF로 저장"),
 * rebuilding reading order from glyph positions: items are bucketed into rows
 * by y-coordinate (top to bottom), then each row is reconstructed with
 * gap-aware spacing. Runs entirely client-side.
 */
export async function extractPdfText(file: File): Promise<string> {
  ensureWorker();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as TextItemLike[];

    const rows = new Map<number, TextItemLike[]>();
    for (const item of items) {
      if (!item.str.trim()) continue;
      const y = Math.round(item.transform[5]);
      const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 3) ?? y;
      const bucket = rows.get(key) ?? [];
      bucket.push(item);
      rows.set(key, bucket);
    }

    const orderedRows = [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, bucket]) => rowText(bucket));
    pageTexts.push(orderedRows.join("\n"));
  }

  return pageTexts.join("\n");
}
