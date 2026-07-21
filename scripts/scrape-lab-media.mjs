// Imports the official 대학원 연구실 소개 자료 및 영상 data. me.yonsei.ac.kr/me/graduate/labs.do renders
// nothing server-side for this section -- it fetches a Google Apps Script Web App JSON endpoint
// client-side (visible in the page's inline <script>) and builds cards from it in the browser. We call
// that same public JSON endpoint directly; it's the actual data source the official page uses.
import fs from "node:fs/promises";
import path from "node:path";
import { downloadFile, absolutize } from "./lib/yonsei-board.mjs";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxHrcj6Qeu1LnFr2knGCESBrDTyoSshxmVZ7rCAJUQu6UAGV9NT45wS0-vA4iTgxNiYyg/exec";
const SOURCE_PAGE = "https://me.yonsei.ac.kr/me/graduate/labs.do";
const OUT = path.resolve("data/graduate-lab-media.json");
const MEDIA_DIR = path.resolve("public/content/graduate/lab-media");

function parseVideo(url) {
  if (!url) return null;
  if (url.includes("youtu")) {
    let id = null;
    const short = url.match(/youtu\.be\/([^?&/]+)/);
    const long = url.match(/[?&]v=([^?&/]+)/);
    const embed = url.match(/embed\/([^?&/]+)/);
    id = short?.[1] || long?.[1] || embed?.[1] || null;
    if (!id) return null;
    return {
      provider: "youtube",
      videoId: id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (url.includes("drive.google.com")) {
    const m = url.match(/\/d\/([^/]+)/);
    const id = m?.[1] || null;
    if (!id) return { provider: "drive", videoId: null, embedUrl: url, watchUrl: url, thumbnailUrl: null };
    return {
      provider: "drive",
      videoId: id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      watchUrl: `https://drive.google.com/file/d/${id}/view`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    };
  }
  return { provider: "other", videoId: null, embedUrl: url, watchUrl: url, thumbnailUrl: null };
}

async function urlOk(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15000) });
    if (!res.ok) return false;
    const type = res.headers.get("content-type") || "";
    return type.startsWith("image/");
  } catch {
    return false;
  }
}

async function main() {
  const res = await fetch(API_URL, { redirect: "follow", signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`labs API fetch failed: HTTP ${res.status}`);
  const raw = await res.json();

  let faculty = [];
  try {
    faculty = JSON.parse(await fs.readFile(path.resolve("data/faculty.json"), "utf-8"));
  } catch {
    faculty = [];
  }

  const errors = [];
  const entries = raw.filter((item) => item["연구실 홍보 동영상"] || item["연구실 홍보 이미지"]);

  const results = [];
  for (const item of entries) {
    const labId = String(item["연번"]);
    const professorName = item["이름"] || null;
    const video = parseVideo(item["연구실 홍보 동영상"]);
    const promoImageUrl = absolutize(item["연구실 홍보 이미지"]) || null;
    const logoUrl = absolutize(item["연구실 로고"]) || null;

    const record = {
      labId,
      professorName,
      professorNameEn: item["영문명"] || null,
      professorPosition: item["직위"] || null,
      labNameKo: item["연구실명"] || null,
      labWebsite: item["연구실 웹사이트"] || null,
      researchField: item["연구분야"] || null,
      mediaType: video ? "video" : "image",
      video,
      promoImageUrl,
      logoUrl,
      matchedFacultySlug: null,
      sourceUrl: SOURCE_PAGE,
    };

    const match = faculty.find((f) => f.name === professorName);
    if (match) record.matchedFacultySlug = match.slug;

    // Verify / localize thumbnails so nothing renders broken.
    const labDir = path.join(MEDIA_DIR, labId);
    if (video?.thumbnailUrl) {
      const ok = await urlOk(video.thumbnailUrl);
      if (ok) {
        const dl = await downloadFile(video.thumbnailUrl, path.join(labDir), `thumbnail.jpg`, errors);
        if (dl.ok) record.video.localThumbnail = `/content/graduate/lab-media/${labId}/${dl.safe}`;
      } else {
        errors.push({ labId, stage: "video-thumbnail-unreachable", url: video.thumbnailUrl });
        record.video.thumbnailUrl = null;
      }
    }
    if (promoImageUrl) {
      const ok = await urlOk(promoImageUrl);
      if (ok) {
        const fname = promoImageUrl.split("/").pop().split("?")[0] || "promo.jpg";
        const dl = await downloadFile(promoImageUrl, path.join(labDir), fname, errors);
        if (dl.ok) record.localPromoImage = `/content/graduate/lab-media/${labId}/${dl.safe}`;
      } else {
        errors.push({ labId, stage: "promo-image-unreachable", url: promoImageUrl });
        record.promoImageUrl = null;
      }
    }
    if (logoUrl) {
      const ok = await urlOk(logoUrl);
      if (ok) {
        const fname = logoUrl.split("/").pop().split("?")[0] || "logo.jpg";
        const dl = await downloadFile(logoUrl, path.join(labDir), fname, errors);
        if (dl.ok) record.localLogo = `/content/graduate/lab-media/${labId}/${dl.safe}`;
      } else {
        record.logoUrl = null;
      }
    }

    results.push(record);
  }

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(
    OUT,
    JSON.stringify(
      { sourceUrl: SOURCE_PAGE, apiUrl: API_URL, importedAt: new Date().toISOString(), total: results.length, errors, items: results },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`Imported ${results.length} lab media entries (${errors.length} errors) -> ${OUT}`);
  console.log(`  video: ${results.filter((r) => r.mediaType === "video").length}, image-only: ${results.filter((r) => r.mediaType === "image").length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
