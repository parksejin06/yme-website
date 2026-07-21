import coursesRaw from "@/data/courses.json";
import legacyRaw from "@/data/graduation-check/legacy-courses.json";
import type { CourseOption } from "./types";

const CONFIRMED: CourseOption[] = coursesRaw.map((c) => ({
  courseCode: c.courseCode,
  nameKr: c.nameKr,
  nameEn: c.nameEn,
  courseType: c.courseType,
  credit: c.credit,
  status: "confirmed",
}));

const DRAFT: CourseOption[] = legacyRaw.courses.map((c) => ({
  courseCode: c.courseCode,
  nameKr: c.nameKr,
  nameEn: c.nameEn,
  courseType: c.courseType,
  credit: c.credit,
  status: "draft",
}));

/** Search index for the graduation-check tool: the real, live course catalog
 * (data/courses.json, also used by CourseExplorer/CurriculumMap) plus a small
 * set of draft placeholder entries for retired courses referenced only in old
 * cohorts' mandatoryCourses (see data/graduation-check/legacy-courses.json).
 * Kept separate from data/courses.json so these drafts never leak into the
 * official course-explorer/curriculum-map pages. */
export const ALL_COURSES: CourseOption[] = [...CONFIRMED, ...DRAFT];

export function searchCourses(query: string, limit = 8): CourseOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_COURSES.filter(
    (c) =>
      c.nameKr.toLowerCase().includes(q) ||
      c.courseCode.toLowerCase().includes(q) ||
      (c.nameEn ?? "").toLowerCase().includes(q)
  ).slice(0, limit);
}
