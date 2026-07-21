import type { RequirementCategory } from "./types";

export interface GradSummaryLike {
  liberalArtsBasic: string | null;
  universityLiberalElective: string | null;
  universityLiberalRequired: string | null;
  basicEducation: string | null;
  majorBasic: string | null;
  majorRequired: string | null;
  majorElective: string | null;
  graduationTotal: string | null;
}

function toNumber(v: string | null | undefined): number | null {
  if (v == null) return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

/**
 * Normalizes a cohort's flat, historically-evolved summary fields (see
 * data/graduation-requirements.json) into a fixed set of comparable
 * categories. The course catalog (data/courses.json) only distinguishes
 * courseType 전필/전선/대교, so the mapping is necessarily coarse:
 * - majorRequired / majorElective map 1:1 onto courseType 전필 / 전선.
 * - majorBasic (전공기초) has no matching courseType anywhere in the course
 *   data, so it's marked unsupported (matchCourseTypes: null) rather than
 *   rendered as a misleading 0/N progress bar.
 * - The various liberal-arts fields (liberalArtsBasic / universityLiberalElective /
 *   universityLiberalRequired / basicEducation) are summed into one aggregate
 *   "교양" bucket matched against courseType 대교, since the course data
 *   doesn't subdivide liberal-arts courses any further than that.
 */
export function getRequirementCategories(summary: GradSummaryLike): RequirementCategory[] {
  const categories: RequirementCategory[] = [];

  const majorRequired = toNumber(summary.majorRequired);
  if (majorRequired != null) {
    categories.push({
      key: "majorRequired",
      labelKr: "전공필수",
      labelEn: "Major Required",
      requiredCredits: majorRequired,
      matchCourseTypes: ["전필"],
    });
  }

  const majorElective = toNumber(summary.majorElective);
  if (majorElective != null) {
    categories.push({
      key: "majorElective",
      labelKr: "전공선택",
      labelEn: "Major Elective",
      requiredCredits: majorElective,
      matchCourseTypes: ["전선"],
    });
  }

  const majorBasic = toNumber(summary.majorBasic);
  if (majorBasic != null) {
    categories.push({
      key: "majorBasic",
      labelKr: "전공기초",
      labelEn: "Major Basic",
      requiredCredits: majorBasic,
      matchCourseTypes: null,
    });
  }

  const liberalFields = [
    summary.liberalArtsBasic,
    summary.universityLiberalElective,
    summary.universityLiberalRequired,
    summary.basicEducation,
  ]
    .map(toNumber)
    .filter((n): n is number => n != null);

  if (liberalFields.length > 0) {
    categories.push({
      key: "liberalArts",
      labelKr: "교양(대학교양 등)",
      labelEn: "Liberal Arts (University Liberal Arts, etc.)",
      requiredCredits: liberalFields.reduce((a, b) => a + b, 0),
      matchCourseTypes: ["대교"],
    });
  }

  return categories;
}
