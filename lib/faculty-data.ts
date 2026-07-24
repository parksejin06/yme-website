import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";
import { redis } from "./redis";
import type { FacultyMember } from "./faculty";
import type { EmeritusFaculty } from "@/components/EmeritusFacultyGrid";

const FACULTY_FILE = path.join(process.cwd(), "data", "faculty.json");
const EMERITUS_FILE = path.join(process.cwd(), "data", "faculty-emeritus.json");

const FACULTY_KEY = "faculty:active";
const EMERITUS_KEY = "faculty:emeritus";

/** Reads from Redis, falling back to the checked-in seed JSON file if that
 * key hasn't been migrated/written yet (same pattern as community-data.ts). */
export async function getFaculty(): Promise<FacultyMember[]> {
  const stored = await redis.get<FacultyMember[]>(FACULTY_KEY);
  return stored ?? JSON.parse(fs.readFileSync(FACULTY_FILE, "utf-8"));
}

export async function getFacultyEmeritus(): Promise<EmeritusFaculty[]> {
  const stored = await redis.get<EmeritusFaculty[]>(EMERITUS_KEY);
  return stored ?? JSON.parse(fs.readFileSync(EMERITUS_FILE, "utf-8"));
}

export async function writeFaculty(list: FacultyMember[]): Promise<void> {
  await redis.set(FACULTY_KEY, list);
}

export async function writeFacultyEmeritus(list: EmeritusFaculty[]): Promise<void> {
  await redis.set(EMERITUS_KEY, list);
}

/** Same Revised-Romanization scheme as scripts/parse-faculty.mjs (surname + given name,
 * hangul-romanization, lowercase). Korean-character slugs hit an NFC/NFD mismatch between
 * generateStaticParams and the Turbopack route matcher, so slugs must stay ASCII. */
function romanize(name: string): string {
  const surname = name.slice(0, 1);
  const given = name.slice(1) || surname;
  return `${hangulRomanization.convert(surname)}-${hangulRomanization.convert(given)}`.toLowerCase();
}

/** Appends -2, -3, ... when the base romanization collides with an existing slug. */
export function generateUniqueSlug(name: string, existingSlugs: string[]): string {
  const base = romanize(name);
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
