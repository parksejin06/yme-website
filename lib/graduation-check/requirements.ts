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
 * categories. courseType values come from two sources: the ME catalog
 * (전필/전선/대교) and, since transcript import, the portal's raw 과목종별
 * codes (전기, 계기, 교기, 공기, 학기, 학필, 학선, ...). Mapping stays coarse:
 * - majorRequired / majorElective map 1:1 onto courseType 전필 / 전선.
 * - majorBasic (전공기초) matches the portal's 전기 code. The ME catalog has
 *   no 전기 courses, so manual catalog-only input still shows 0/N here —
 *   transcript import is the supported path for this category.
 * - The various liberal-arts fields (liberalArtsBasic / universityLiberalElective /
 *   universityLiberalRequired / basicEducation) are summed into one aggregate
 *   "교양" bucket matched against 대교 plus the portal's liberal/basic codes
 *   (계기 counts here because basicEducation is part of the aggregate).
 * - RC/CC(채플) and 일반선택-type codes stay uncategorized on purpose: they
 *   count toward the graduation total only, mirroring how the portal treats
 *   them outside the 교양 credit areas.
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
      matchCourseTypes: ["전기"],
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
      // 채플(교기/CC)·RC·글쓰기(공기)·학문영역(학기/학필/학선)·계열기초(계기)까지
      // 교양기초 안에서 인정되므로 교양으로 집계한다.
      matchCourseTypes: ["대교", "교기", "교필", "교선", "공기", "학기", "학필", "학선", "계기", "CC", "RC"],
    });
  }

  // 일반선택(자유선택): 졸업 총학점에서 전공·교양 필수치를 뺀 나머지. 이 학점이 빠져
  // 있으면 130학점의 상당 부분(예: 25학번 21학점)이 어디에도 표시되지 않는다.
  const graduationTotal = toNumber(summary.graduationTotal);
  if (graduationTotal != null) {
    const accounted = categories.reduce((sum, c) => sum + (c.requiredCredits ?? 0), 0);
    const freeElective = graduationTotal - accounted;
    if (freeElective > 0) {
      categories.push({
        key: "freeElective",
        labelKr: "일반선택",
        labelEn: "Free Elective",
        requiredCredits: freeElective,
        matchCourseTypes: [],
        leftover: true,
      });
    }
  }

  return categories;
}
