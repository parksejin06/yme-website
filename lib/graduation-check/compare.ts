import type { CategoryResult, ComparisonResult, CourseOption, SelectedCourse } from "./types";
import { getRequirementCategories, type GradSummaryLike } from "./requirements";
import { ALL_COURSES } from "./course-index";
import { RECOMMENDATION_LIMIT } from "./constants";

export interface RequirementEntry {
  summary: GradSummaryLike;
  mandatoryCourses: string[];
}

const normalizeName = (s: string) => s.replace(/[()（） ]/g, "");

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
 * degree rather than double-counting it. */
export function compareRequirements(entry: RequirementEntry, allSelected: SelectedCourse[]): ComparisonResult {
  const uniqueByCode = new Map<string, SelectedCourse>();
  for (const c of allSelected) uniqueByCode.set(c.courseCode, c);
  const unique = [...uniqueByCode.values()];

  const categories = getRequirementCategories(entry.summary);
  const categoryResults: CategoryResult[] = categories.map((cat) => {
    if (!cat.matchCourseTypes) return { ...cat, earnedCredits: 0, supported: false };
    const matchTypes = cat.matchCourseTypes;
    const earnedCredits = unique.filter((c) => matchTypes.includes(c.courseType)).reduce((sum, c) => sum + c.credit, 0);
    return { ...cat, earnedCredits, supported: true };
  });

  const graduationTotal = entry.summary.graduationTotal != null ? parseInt(entry.summary.graduationTotal, 10) : null;
  const totalEarnedCredits = unique.reduce((sum, c) => sum + c.credit, 0);

  const completedMandatoryCourses = entry.mandatoryCourses.filter((name) =>
    unique.some((c) => normalizeName(c.nameKr) === normalizeName(name))
  );
  const missingMandatoryCourses = entry.mandatoryCourses.filter((name) => !completedMandatoryCourses.includes(name));

  const recommendations: Record<string, CourseOption[]> = {};
  for (const cat of categoryResults) {
    if (!cat.supported || cat.matchCourseTypes == null || cat.requiredCredits == null) continue;
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
