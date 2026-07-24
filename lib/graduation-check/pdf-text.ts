import * as pdfjsLib from "pdfjs-dist";

// Self-hosted worker (bundled via the URL below) — no external CDN request,
// so the uploaded transcript never leaves the browser.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface TextItemLike {
  str: string;
  transform: number[];
}

/**
 * Extracts text from a transcript PDF (the portal's 출력 → "PDF로 저장"),
 * reconstructing reading order from glyph positions. pdf.js returns text
 * items in stream order, which for a table is scrambled; grouping items by
 * their y-coordinate into rows (then sorting each row left-to-right) rebuilds
 * the "과목종별 학정번호 ... 학점 평가" row layout the parser expects.
 *
 * Runs entirely client-side. Never uploads the file.
 */
export async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as TextItemLike[];

    // Bucket items into rows by rounded y (PDF origin is bottom-left, so a
    // larger y is higher on the page → earlier in reading order).
    const rows = new Map<number, TextItemLike[]>();
    for (const item of items) {
      if (!item.str.trim()) continue;
      const y = Math.round(item.transform[5]);
      // Merge items within 3pt vertically into the same row.
      const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 3) ?? y;
      const bucket = rows.get(key) ?? [];
      bucket.push(item);
      rows.set(key, bucket);
    }

    const orderedRows = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, bucket]) =>
        bucket
          .sort((a, b) => a.transform[4] - b.transform[4])
          .map((i) => i.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      );

    pageTexts.push(orderedRows.join("\n"));
  }

  return pageTexts.join("\n");
}
