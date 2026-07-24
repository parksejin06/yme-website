import type { RequirementCategory } from "./types";
import liberalArtsAreas from "@/data/graduation-check/liberal-arts-areas.json";

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
 * Normalizes a cohort's flat summary fields (data/graduation-requirements.json)
 * into the exact category breakdown the department publishes (confirmed
 * against the official 25학번 이수체계표: 교양기초8 + 대학교양(선택12+필수27) +
 * 기초교육2 + 전공(필수24+선택36) + 일반선택21 = 130).
 *
 * Course matching is exclusive and priority-ordered (see compare.ts): a
 * course is claimed by the first category below it matches, so it's never
 * double-counted. Two matching strategies are used:
 *  - matchCourseNames: exact department-mandated course names. Required for
 *    교양기초/대학교양(필수)/기초교육 because the portal's own 과목종별 code is
 *    NOT reliable for these -- e.g. 공학수학(1)/(2) show as 계기 on the
 *    transcript while 공학수학(3) shows as 전기, even though all four
 *    (공학수학(1)-(4), 공학정보처리, 공학물리학및실험(1)(2), 공학화학및실험(1)(2))
 *    count identically toward the same 27-credit 대학교양(필수) requirement.
 *  - matchCourseTypes: portal/catalog courseType, reliable for 전필/전선 and
 *    as a catch-all for remaining liberal-arts-coded courses.
 */
export function getRequirementCategories(summary: GradSummaryLike): RequirementCategory[] {
  const categories: RequirementCategory[] = [];

  const liberalArtsBasic = toNumber(summary.liberalArtsBasic);
  if (liberalArtsBasic != null) {
    categories.push({
      key: "liberalArtsBasic",
      labelKr: "교양기초",
      labelEn: "Basic Liberal Arts",
      requiredCredits: liberalArtsBasic,
      matchCourseTypes: null,
      // 기독교와현대사회/기독교와세계문화/성서와기독교 중 하나만 들으면 인정 (통칭
      // "기독교의 이해"는 실제 과목명이 아니라서 매칭에서 제외).
      matchCourseNames: ["채플", "글쓰기", "기독교와현대사회", "기독교와세계문화", "성서와기독교"],
    });
  }

  const universityLiberalRequired = toNumber(summary.universityLiberalRequired);
  if (universityLiberalRequired != null) {
    categories.push({
      key: "universityLiberalRequired",
      labelKr: "대학교양(필수)",
      labelEn: "University Liberal Arts (Required)",
      requiredCredits: universityLiberalRequired,
      matchCourseTypes: null,
      matchCourseNames: [
        "공학수학(1)", "공학수학(2)", "공학수학(3)", "공학수학(4)",
        "공학정보처리",
        "공학물리학및실험(1)", "공학물리학및실험(2)",
        "공학화학및실험(1)", "공학화학및실험(2)",
      ],
    });
  }

  const basicEducation = toNumber(summary.basicEducation);
  if (basicEducation != null) {
    categories.push({
      key: "basicEducation",
      labelKr: "기초교육",
      labelEn: "Basic Education",
      requiredCredits: basicEducation,
      matchCourseTypes: null,
      matchCourseNames: ["RC101", "RC 101", "사회참여"],
    });
  }

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

  const universityLiberalElective = toNumber(summary.universityLiberalElective);
  if (universityLiberalElective != null) {
    categories.push({
      key: "universityLiberalElective",
      labelKr: "대학교양(선택)",
      labelEn: "University Liberal Arts (Elective)",
      requiredCredits: universityLiberalElective,
      // Catch-all for remaining generic liberal-arts-coded courses not
      // already claimed by name above (문학과예술/인간과역사/... 영역 과목들).
      matchCourseTypes: ["대교", "교기", "교필", "교선", "공기", "학기", "학필", "학선", "계기"],
      // 6개 영역 중 4개 영역, 영역당 3학점까지만 인정 -- 초과분은 일반선택으로 이월.
      capExcessToLeftover: true,
      // 영역별 실제 개설 과목 목록 (학부대학 교양교육과정 공개 페이지에서 확인, 로그인 불필요).
      areaGroups: liberalArtsAreas,
      requiredAreaCount: 4,
      caveatKr: "영역 매칭은 과목명 기준이라, 과목명이 바뀌었거나 목록에 없는 과목이면 실제와 다를 수 있습니다. 정확한 인정 여부는 학사팀 확인이 필요합니다.",
      caveatEn: "Area matching is based on course names, so renamed or unlisted courses may not match correctly. Confirm exact credit recognition with the Academic Affairs team.",
    });
  }

  // 일반선택(자유선택): 졸업 총학점에서 위 카테고리 필수치를 뺀 나머지. 이 학점이
  // 빠져 있으면 130학점의 상당 부분(예: 25학번 21학점)이 어디에도 표시되지 않는다.
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
