// Regenerates content-source-manifest.json from the per-import reports already written by
// scrape-community.mjs / scrape-calendar.mjs / scrape-lab-media.mjs. Run after any re-import.
import fs from "node:fs/promises";

async function main() {
  const communityReport = JSON.parse(await fs.readFile("data/community/_import-report.json", "utf-8"));
  const calendar = JSON.parse(await fs.readFile("data/community/calendar-official.json", "utf-8"));
  const labs = JSON.parse(await fs.readFile("data/graduate-lab-media.json", "utf-8"));

  const manifest = {
    generatedAt: new Date().toISOString(),
    communityBoards: communityReport.boards.map((b) => ({
      key: b.key,
      label: b.label,
      sourceUrl: b.sourceUrl,
      imported: b.imported,
      attachments: b.attachments,
      images: b.images,
      errors: b.errors.length,
    })),
    calendar: {
      sourceUrl: calendar.sourceUrl,
      icsUrl: calendar.icsUrl,
      importedAt: calendar.importedAt,
      totalEvents: calendar.totalEvents,
      errors: calendar.errors.length,
    },
    graduateLabMedia: {
      sourceUrl: labs.sourceUrl,
      apiUrl: labs.apiUrl,
      importedAt: labs.importedAt,
      total: labs.total,
      video: labs.items.filter((i) => i.mediaType === "video").length,
      imageOnly: labs.items.filter((i) => i.mediaType === "image").length,
      errors: labs.errors.length,
    },
  };

  await fs.writeFile("content-source-manifest.json", JSON.stringify(manifest, null, 2), "utf-8");
  console.log("wrote content-source-manifest.json");
}

main();
