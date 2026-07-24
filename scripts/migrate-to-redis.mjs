// One-time migration: pushes the checked-in data/*.json seed files into
// Upstash Redis, so the admin panel's Redis-backed reads/writes
// (lib/community-data.ts, lib/faculty-data.ts) have real data to start from.
//
// Run with: node --env-file=.env.local scripts/migrate-to-redis.mjs
// Add --force to overwrite keys that already exist in Redis (default: skips
// them, so re-running this never clobbers live admin edits).
import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

const FORCE = process.argv.includes("--force");

const redis = Redis.fromEnv();

const COMMUNITY_DIR = path.resolve("data/community");
const BOARD_FILES = {
  "notices-undergraduate": "notices-undergraduate.json",
  "notices-graduate": "notices-graduate.json",
  "notices-external": "notices-external.json",
  "notices-scholarship": "notices-scholarship.json",
  news: "news.json",
  "thesis-reviews": "thesis-reviews.json",
  resources: "resources.json",
  jobs: "jobs.json",
  events: "events.json",
  seminars: "seminars.json",
};

const FACULTY_ENTRIES = [
  { key: "faculty:active", file: path.resolve("data/faculty.json") },
  { key: "faculty:emeritus", file: path.resolve("data/faculty-emeritus.json") },
];

async function migrateOne(redisKey, filePath, label) {
  const existing = await redis.get(redisKey);
  if (existing !== null && !FORCE) {
    const count = Array.isArray(existing) ? existing.length : "?";
    console.log(`skip  ${label} (${redisKey}) — already has ${count} entries in Redis, use --force to overwrite`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  await redis.set(redisKey, data);
  console.log(`${existing !== null ? "OVERWRITE" : "write"} ${label} (${redisKey}) — ${data.length} entries`);
}

async function main() {
  console.log(`Migrating to Upstash Redis${FORCE ? " (--force: overwriting existing keys)" : ""}...\n`);

  for (const [board, fileName] of Object.entries(BOARD_FILES)) {
    await migrateOne(`board:${board}`, path.join(COMMUNITY_DIR, fileName), board);
  }
  for (const { key, file } of FACULTY_ENTRIES) {
    await migrateOne(key, file, key);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
