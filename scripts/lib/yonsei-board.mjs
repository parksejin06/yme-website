// Generic scraper for the me.yonsei.ac.kr community board engine (shared by notice/notice2/notice3/
// notice4/news/degree_thesis_review/information/job/seminar_graduate1/seminar). All of these boards
// share the same list-table + dl.board-write-box detail markup, confirmed by manual inspection of
// live HTML from each of the 10 URLs before writing this scraper.
//
// Source of truth: the live page IS the source. We never invent, reword, or summarize what we parse
// out of `.fr-view` (the official post body). excerpt is a mechanical slice of plain text, not an
// AI summary.
import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import fs from "node:fs/promises";
import path from "node:path";

export const BASE = "https://me.yonsei.ac.kr/me/community/";
export const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export function absolutize(src) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return "https://me.yonsei.ac.kr" + src;
  return src;
}

async function fetchText(url, { retries = 4 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export async function fetchListMeta(boardPath, limit) {
  const url = `${BASE}${boardPath}?mode=list&articleLimit=${limit}&article.offset=0`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const rows = [];
  const seen = new Set();
  // Two list templates exist across these boards: a <table class="board-table"> (most boards) and a
  // <ul class="board-list-wrap"> thumbnail-gallery layout (news.do). Both are scanned; whichever the
  // page actually used is the one that yields rows.
  $("table.board-table tbody tr, ul.board-list-wrap > li").each((_, el) => {
    const $el = $(el);
    const link = $el.find("a[href*='mode=view']").first();
    const href = link.attr("href");
    if (!href) return;
    const m = href.match(/articleNo=(\d+)/);
    if (!m) return;
    const articleNo = m[1];
    if (seen.has(articleNo)) return;
    seen.add(articleNo);
    const isPinned = ($el.attr("class") || "").includes("top-wrap") || $el.find("[class*='top-wrap']").length > 0;
    const isNew = $el.find("[class*='new-icon']").length > 0;
    const hasAttachmentIcon = $el.find(".c-board-file-icon").length > 0;
    rows.push({ articleNo, isPinned, isNew, hasAttachmentIcon });
  });
  return { rows, url };
}

function dlMap($, scope) {
  const map = {};
  scope.find("dl.board-write-box").each((_, dl) => {
    const $dl = $(dl);
    const key = $dl.find("dt").first().text().trim();
    if (key) map[key] = $dl.find("dd").first();
  });
  return map;
}

export async function fetchDetail(boardPath, articleNo) {
  const url = `${BASE}${boardPath}?mode=view&articleNo=${articleNo}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const scope = $(".board-write-wrap").first().length ? $(".board-write-wrap").first() : $.root();
  const map = dlMap($, scope);

  const title = map["제목"]?.text().trim() || null;
  const publishedAt = map["작성일"]?.text().trim() || null;
  const author = map["작성자"]?.text().trim() || null;

  const frView = scope.find(".fr-view").first();
  const hasContent = frView.length > 0;

  const contentImages = [];
  if (hasContent) {
    let inlineIdx = 0;
    frView.find("img").each((_, img) => {
      const $img = $(img);
      const rawSrc = $img.attr("src");
      if (!rawSrc) return;
      // CMS editor sometimes embeds pasted screenshots as base64 data: URIs directly in the HTML
      // instead of an uploaded file. These aren't a normal remote URL to download from -- decoding
      // them to a real file (done in scrape-community.mjs) needs a stable synthetic name, not one
      // derived from the (multi-megabyte) data string itself.
      if (rawSrc.startsWith("data:")) {
        const mimeMatch = rawSrc.match(/^data:([^;,]+)/);
        contentImages.push({
          sourceUrl: rawSrc,
          isDataUri: true,
          mimeType: mimeMatch?.[1] || "image/png",
          inlineName: `inline-${inlineIdx++}`,
          alt: $img.attr("data-alt") || $img.attr("alt") || null,
          width: Number($img.attr("data-width")) || null,
          height: Number($img.attr("data-height")) || null,
        });
        return;
      }
      const src = absolutize(rawSrc);
      if (!src) return;
      contentImages.push({
        sourceUrl: src,
        alt: $img.attr("data-alt") || $img.attr("alt") || null,
        width: Number($img.attr("data-width")) || null,
        height: Number($img.attr("data-height")) || null,
      });
    });
  }

  const originalHtml = hasContent
    ? sanitizeHtml(frView.html() || "", {
        allowedTags: [
          "p", "br", "strong", "b", "em", "i", "u", "span", "div", "a", "ul", "ol", "li",
          "table", "thead", "tbody", "tr", "td", "th", "img", "h1", "h2", "h3", "h4", "blockquote", "hr",
        ],
        allowedAttributes: {
          a: ["href", "target", "rel"],
          img: ["src", "alt", "width", "height"],
          span: ["style"],
          p: ["style"],
          div: ["style"],
          td: ["colspan", "rowspan", "style"],
          th: ["colspan", "rowspan", "style"],
          table: ["style"],
        },
        allowedStyles: {
          "*": {
            color: [/^.*$/],
            "background-color": [/^.*$/],
            "text-align": [/^.*$/],
            "font-size": [/^.*$/],
            "font-family": [/^.*$/],
          },
        },
        transformTags: {
          img: (tagName, attribs) => ({ tagName: "img", attribs: { ...attribs, src: absolutize(attribs.src), loading: "lazy" } }),
          a: (tagName, attribs) => ({ tagName: "a", attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } }),
        },
        allowedSchemes: ["http", "https", "mailto", "data"],
      })
    : "";

  const NEWLINE = String.fromCharCode(10);
  const blockBreakHtml = hasContent
    ? originalHtml.replace(/<br\s*\/?>/gi, NEWLINE).replace(/<\/(p|div|li|tr|h[1-6])>/gi, NEWLINE)
    : "";
  const plainText = hasContent
    ? cheerio
        .load(blockBreakHtml)("body")
        .text()
        .split(NEWLINE)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
        .join(NEWLINE)
        .trim()
    : "";
  const excerpt = plainText.slice(0, 140);

  const attachments = [];
  const attachDd = map["첨부"];
  if (attachDd) {
    attachDd.find("a.file-down-btn").each((_, a) => {
      const $a = $(a);
      const href = $a.attr("href");
      if (!href) return;
      const fileName = $a.text().trim();
      const ext = (fileName.split(".").pop() || "").toLowerCase();
      attachments.push({
        fileName,
        fileUrl: `${BASE}${boardPath}${href}`,
        fileType: ext || null,
      });
    });
  }

  return {
    sourcePostId: articleNo,
    title,
    author,
    publishedAt,
    originalHtml,
    plainText,
    excerpt,
    attachments,
    contentImages,
    sourceUrl: url,
    hasBody: hasContent,
  };
}

export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const cur = idx++;
      results[cur] = await fn(items[cur], cur);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const MAX_FILENAME_BYTES = 120;

function safeFileName(name) {
  const cleaned = name.replace(/[<>:"/\|?*s-]/g, "_").trim() || "file";
  if (Buffer.byteLength(cleaned, "utf-8") <= MAX_FILENAME_BYTES) return cleaned;
  const dot = cleaned.lastIndexOf(".");
  const ext = dot > 0 ? cleaned.slice(dot) : "";
  const stem = dot > 0 ? cleaned.slice(0, dot) : cleaned;
  const buf = Buffer.from(stem, "utf-8").subarray(0, MAX_FILENAME_BYTES - Buffer.byteLength(ext, "utf-8"));
  let truncated = buf.toString("utf-8");
  while (truncated.includes("�") && truncated.length > 0) truncated = truncated.slice(0, -1);
  return (truncated || "file") + ext;
}

export async function downloadFile(url, destDir, fileName, errors, cookieHeader) {
  await fs.mkdir(destDir, { recursive: true });
  const safe = safeFileName(fileName);
  const dest = path.join(destDir, safe);
  let lastErr;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
        signal: AbortSignal.timeout(30000),
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) throw new Error("empty body");
      await fs.writeFile(dest, buf);
      return { ok: true, safe, size: buf.length };
    } catch (err) {
      lastErr = err;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  errors.push({ url, fileName, error: String(lastErr?.message || lastErr) });
  return { ok: false, safe: null, size: 0 };
}
