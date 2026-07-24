import type { CategoryResult, ComparisonResult, CourseOption, RequirementCategory, SelectedCourse } from "./types";
import { getRequirementCategories, type GradSummaryLike } from "./requirements";
import { ALL_COURSES } from "./course-index";
import { RECOMMENDATION_LIMIT } from "./constants";

export interface RequirementEntry {
  summary: GradSummaryLike;
  mandatoryCourses: string[];
}

const normalizeName = (s: string) => s.replace(/[()（） ]/g, "");

/** True if a course counts toward this category, by exact-name match first
 * (department-mandated courses, portal-code-independent) then courseType. */
function categoryMatches(cat: RequirementCategory, course: SelectedCourse): boolean {
  if (cat.matchCourseNames) {
    const normalized = normalizeName(course.nameKr);
    if (cat.matchCourseNames.some((n) => normalized.includes(normalizeName(n)))) return true;
  }
  return cat.matchCourseTypes != null && cat.matchCourseTypes.includes(course.courseType);
}

function pickRecommendations(courseTypes: string[], selected: SelectedCourse[]): CourseOption[] {
  const takenCodes = new Set(selected.map((c) => c.courseCode));
  return ALL_COURSES.filter((c) => courseTypes.includes(c.courseType) && !takenCodes.has(c.courseCode))
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "confirmed" ? -1 : 1))
    .slice(0, RECOMMENDATION_LIMIT);
}

/** Compares a student's selected courses (across all semesters) against one
 * cohort's graduation requirements. A course retaken in a later semester is
 * counted once (deduped by courseCode) for both credit totals and mandatory
 * course completion, matching how a retake would actually count toward a
 * degree rather than double-counting it.
 *
 * Each course is claimed by exactly one category -- the first one (in the
 * priority order returned by getRequirementCategories) it matches -- so
 * credits are never double-counted across categories. 일반선택 (leftover)
 * then collects whatever no category claimed. */
export function compareRequirements(entry: RequirementEntry, allSelected: SelectedCourse[]): ComparisonResult {
  const uniqueByCode = new Map<string, SelectedCourse>();
  for (const c of allSelected) uniqueByCode.set(c.courseCode, c);
  const unique = [...uniqueByCode.values()];

  const graduationTotal = entry.summary.graduationTotal != null ? parseInt(entry.summary.graduationTotal, 10) : null;
  const totalEarnedCredits = unique.reduce((sum, c) => sum + c.credit, 0);

  const categories = getRequirementCategories(entry.summary);
  const claimable = categories.filter((c) => !c.leftover);

  const earnedByKey = new Map<string, number>();
  let claimedTotal = 0;
  for (const course of unique) {
    const cat = claimable.find((c) => categoryMatches(c, course));
    if (!cat) continue;
    earnedByKey.set(cat.key, (earnedByKey.get(cat.key) ?? 0) + course.credit);
    claimedTotal += course.credit;
  }

  const categoryResults: CategoryResult[] = categories.map((cat) => {
    if (cat.leftover) {
      return { ...cat, earnedCredits: Math.max(totalEarnedCredits - claimedTotal, 0), supported: true };
    }
    if (cat.matchCourseTypes == null && !cat.matchCourseNames) return { ...cat, earnedCredits: 0, supported: false };
    return { ...cat, earnedCredits: earnedByKey.get(cat.key) ?? 0, supported: true };
  });

  const completedMandatoryCourses = entry.mandatoryCourses.filter((name) =>
    unique.some((c) => normalizeName(c.nameKr) === normalizeName(name))
  );
  const missingMandatoryCourses = entry.mandatoryCourses.filter((name) => !completedMandatoryCourses.includes(name));

  const recommendations: Record<string, CourseOption[]> = {};
  for (const cat of categoryResults) {
    if (!cat.supported || !cat.matchCourseTypes || cat.matchCourseTypes.length === 0 || cat.requiredCredits == null) continue;
    if (cat.earnedCredits >= cat.requiredCredits) continue;
    const picks = pickRecommendations(cat.matchCourseTypes, unique);
    if (picks.length > 0) recommendations[cat.key] = picks;
  }

  return {
    categories: categoryResults,
    totalRequiredCredits: graduationTotal != null && !Number.isNaN(graduationTotal) ? graduationTotal : null,
    totalEarnedCredits,
    completedMandatoryCourses,
    missingMandatoryCourses,
    recommendations,
  };
}
