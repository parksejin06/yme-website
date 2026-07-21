// Real-data importer for 뉴스 및 공지사항. Pulls every post from the live me.yonsei.ac.kr community
// boards (list + detail), verbatim: original title/author/date, sanitized original HTML body,
// mechanically-sliced excerpt (no AI summarization), real attachments and content images.
//
// Usage: node scripts/scrape-community.mjs [boardKey ...]   (no args = all boards)
import fs from "node:fs/promises";
import path from "node:path";
import { fetchListMeta, fetchDetail, mapLimit, downloadFile, BASE } from "./lib/yonsei-board.mjs";

const BOARDS = [
  { key: "notices-undergraduate", path: "notice.do", label: "학부 공지사항", limit: 150 },
  { key: "notices-graduate", path: "notice2.do", label: "대학원 공지사항", limit: 150 },
  { key: "notices-external", path: "notice3.do", label: "외부기관 공지사항", limit: 100 },
  { key: "notices-scholarship", path: "notice4.do", label: "장학생 선발공고", limit: 100 },
  { key: "news", path: "news.do", label: "뉴스", limit: 150 },
  { key: "thesis-reviews", path: "degree_thesis_review.do", label: "학위논문심사", limit: 100 },
  { key: "resources", path: "information.do", label: "자료실", limit: 1000 },
  { key: "jobs", path: "job.do", label: "취업정보", limit: 150 },
  { key: "events", path: "seminar_graduate1.do", label: "행사", limit: 1000 },
  { key: "seminars", path: "seminar.do", label: "세미나", limit: 150 },
];

const DATA_DIR = path.resolve("data/community");
const PUBLIC_DIR = path.resolve("public/content/community");
const CONCURRENCY = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extFromUrl(u) {
  const clean = u.split("?")[0];
  const base = clean.split("/").pop() || "file";
  return base;
}

const MIME_EXT = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "image/svg+xml": "svg" };

async function writeDataUriImage(dataUri, mimeType, destDir, name, errors) {
  await fs.mkdir(destDir, { recursive: true });
  const ext = MIME_EXT[mimeType] || "png";
  const fileName = `${name}.${ext}`;
  const dest = path.join(destDir, fileName);
  try {
    const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
    const buf = Buffer.from(base64, "base64");
    if (buf.length === 0) throw new Error("empty decoded data URI");
    await fs.writeFile(dest, buf);
    return { ok: true, safe: fileName, size: buf.length };
  } catch (err) {
    errors.push({ stage: "data-uri-decode", fileName, error: String(err?.message || err) });
    return { ok: false, safe: null, size: 0 };
  }
}

async function scrapeBoard(board, report) {
  console.log(`\n=== ${board.label} (${board.key}) ===`);
  const { rows, url: listUrl } = await fetchListMeta(board.path, board.limit);
  console.log(`  list: ${rows.length} rows found at ${listUrl}`);

  const errors = [];
  const posts = await mapLimit(rows, CONCURRENCY, async (row) => {
    try {
      const detail = await fetchDetail(board.path, row.articleNo);
      return { ...detail, isPinned: row.isPinned, isNew: row.isNew };
    } catch (err) {
      errors.push({ articleNo: row.articleNo, stage: "detail-fetch", error: String(err?.message || err) });
      return null;
    }
  });

  const goodPosts = posts.filter(Boolean).filter((p) => p.title);
  const missingTitle = posts.filter((p) => p && !p.title).length;
  if (missingTitle) errors.push({ stage: "missing-title-count", count: missingTitle });

  // Download attachments + content images
  let attachCount = 0;
  let imageCount = 0;
  for (const post of goodPosts) {
    const postDir = path.join(PUBLIC_DIR, board.key, post.sourcePostId);
    if (post.attachments.length) {
      const attachDir = path.join(postDir, "attachments");
      for (const att of post.attachments) {
        const result = await downloadFile(att.fileUrl, attachDir, att.fileName, errors);
        if (result.ok) {
          att.localPath = `/content/community/${board.key}/${post.sourcePostId}/attachments/${result.safe}`;
          att.fileSize = result.size;
          attachCount++;
        } else {
          att.localPath = null;
        }
      }
    }
    if (post.contentImages.length) {
      const imgDir = path.join(postDir, "images");
      for (const img of post.contentImages) {
        const result = img.isDataUri
          ? await writeDataUriImage(img.sourceUrl, img.mimeType, imgDir, img.inlineName, errors)
          : await downloadFile(img.sourceUrl, imgDir, extFromUrl(img.sourceUrl), errors);
        if (result.ok) {
          img.localPath = `/content/community/${board.key}/${post.sourcePostId}/images/${result.safe}`;
          imageCount++;
          // Point the rendered body at the local copy instead of hotlinking (or, for data: URIs,
          // instead of keeping a multi-megabyte base64 string inline in the HTML/JSON).
          post.originalHtml = post.originalHtml.split(img.sourceUrl).join(img.localPath);
          // Once decoded to a real file, the original base64 payload has done its job -- keeping
          // it in the post JSON would ship megabytes of base64 to the client as component props.
          if (img.isDataUri) img.sourceUrl = `data:${img.mimeType};base64,(decoded to ${img.localPath})`;
        } else {
          img.localPath = null;
        }
      }
    }
  }

  const now = new Date().toISOString();
  const final = goodPosts.map((p) => ({
    id: `${board.key}-${p.sourcePostId}`,
    sourceBoard: board.key,
    sourcePostId: p.sourcePostId,
    category: board.label,
    title: p.title,
    author: p.author,
    publishedAt: p.publishedAt,
    isPinned: p.isPinned,
    isNew: p.isNew,
    originalHtml: p.originalHtml,
    plainText: p.plainText,
    excerpt: p.excerpt,
    attachments: p.attachments,
    contentImages: p.contentImages,
    sourceUrl: p.sourceUrl,
    importedAt: now,
  }));

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${board.key}.json`), JSON.stringify(final, null, 2), "utf-8");

  console.log(`  saved ${final.length} posts, ${attachCount} attachments, ${imageCount} images, ${errors.length} errors`);

  report.boards.push({
    key: board.key,
    label: board.label,
    sourceUrl: `${BASE}${board.path}`,
    requested: rows.length,
    imported: final.length,
    attachments: attachCount,
    images: imageCount,
    errors,
  });
}

async function main() {
  const args = process.argv.slice(2);
  const targets = args.length ? BOARDS.filter((b) => args.includes(b.key)) : BOARDS;
  const report = { generatedAt: new Date().toISOString(), boards: [] };

  for (const board of targets) {
    try {
      await scrapeBoard(board, report);
    } catch (err) {
      console.error(`\n!!! ${board.label} (${board.key}) failed, skipping: ${err?.message || err}`);
      report.boards.push({ key: board.key, label: board.label, sourceUrl: `${BASE}${board.path}`, requested: 0, imported: 0, attachments: 0, images: 0, errors: [{ stage: "board-fatal", error: String(err?.message || err) }] });
    }
    await sleep(1500);
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, "_import-report.json"), JSON.stringify(report, null, 2), "utf-8");

  console.log("\n=== SUMMARY ===");
  for (const b of report.boards) {
    console.log(`${b.label}: ${b.imported}/${b.requested} imported, ${b.attachments} attachments, ${b.images} images, ${b.errors.length} errors`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
