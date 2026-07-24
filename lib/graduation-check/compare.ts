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

  // Categories like 대학교양(선택) have a hard cap (4 영역 x 3학점 = 12) -- credits
  // beyond that don't count toward the category. Uncap them from claimedTotal too
  // so the overflow flows into 일반선택 below instead of vanishing.
  for (const cat of claimable) {
    if (!cat.capExcessToLeftover || cat.requiredCredits == null) continue;
    const earned = earnedByKey.get(cat.key) ?? 0;
    if (earned > cat.requiredCredits) {
      claimedTotal -= earned - cat.requiredCredits;
      earnedByKey.set(cat.key, cat.requiredCredits);
    }
  }

  // Area-diversity tracking (e.g. 대학교양(선택)'s 6개 영역 중 4개): a course only
  // counts toward an area if it also belongs to this category in the first place
  // (categoryMatches), so courseType-matched-but-unlisted courses still add credit
  // above but don't count toward any area.
  const completedAreasByKey = new Map<string, Set<string>>();
  for (const cat of claimable) {
    if (!cat.areaGroups) continue;
    const completed = new Set<string>();
    for (const course of unique) {
      if (!categoryMatches(cat, course)) continue;
      const normalized = normalizeName(course.nameKr);
      for (const [area, names] of Object.entries(cat.areaGroups)) {
        if (names.some((n) => normalized.includes(normalizeName(n)))) {
          completed.add(area);
          break;
        }
      }
    }
    completedAreasByKey.set(cat.key, completed);
  }

  const categoryResults: CategoryResult[] = categories.map((cat) => {
    if (cat.leftover) {
      return { ...cat, earnedCredits: Math.max(totalEarnedCredits - claimedTotal, 0), supported: true };
    }
    if (cat.matchCourseTypes == null && !cat.matchCourseNames) return { ...cat, earnedCredits: 0, supported: false };
    const completedAreas = completedAreasByKey.get(cat.key);
    return {
      ...cat,
      earnedCredits: earnedByKey.get(cat.key) ?? 0,
      supported: true,
      completedAreas: completedAreas ? [...completedAreas] : undefined,
    };
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
