import fs from "node:fs";
import path from "node:path";
import hangulRomanization from "hangul-romanization";
import type { FacultyMember } from "./faculty";
import type { EmeritusFaculty } from "@/components/EmeritusFacultyGrid";

const FACULTY_FILE = path.join(process.cwd(), "data", "faculty.json");
const EMERITUS_FILE = path.join(process.cwd(), "data", "faculty-emeritus.json");

/** Fresh off disk on every call so admin edits show up without a server restart. */
export function getFaculty(): FacultyMember[] {
  return JSON.parse(fs.readFileSync(FACULTY_FILE, "utf-8"));
}

export function getFacultyEmeritus(): EmeritusFaculty[] {
  return JSON.parse(fs.readFileSync(EMERITUS_FILE, "utf-8"));
}

export function writeFaculty(list: FacultyMember[]): void {
  fs.writeFileSync(FACULTY_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
}

export function writeFacultyEmeritus(list: EmeritusFaculty[]): void {
  fs.writeFileSync(EMERITUS_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
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
