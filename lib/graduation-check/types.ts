/** Regular + seasonal (여름/겨울) semesters, in academic order per year. */
export type SemesterKey =
  | "1-1" | "1-su" | "1-2" | "1-wi"
  | "2-1" | "2-su" | "2-2" | "2-wi"
  | "3-1" | "3-su" | "3-2" | "3-wi"
  | "4-1" | "4-su" | "4-2" | "4-wi";

export interface CourseOption {
  courseCode: string;
  nameKr: string;
  nameEn: string | null;
  /** ME catalog courses use 전필/전선/대교; transcript-imported and manually
   * added courses carry the portal's raw 과목종별 code (전기, 계기, 교기, ...). */
  courseType: string;
  credit: number;
  /** confirmed/draft = from the ME course catalog; imported = parsed from a
   * pasted portal transcript; manual = free-form user entry. */
  status: "confirmed" | "draft" | "imported" | "manual";
}

export type SelectedCourse = CourseOption;

export type SemesterMap = Record<SemesterKey, SelectedCourse[]>;

export interface GraduationCheckState {
  admissionSlug: string | null;
  semesters: SemesterMap;
}

export interface RequirementCategory {
  key: string;
  labelKr: string;
  labelEn: string;
  requiredCredits: number | null;
  /** courseType values (portal 과목종별 codes, or 전필/전선 from the ME catalog)
   * that count toward this category. Checked only when matchCourseNames
   * doesn't already claim the course — see compare.ts's exclusive assignment.
   * null (with matchCourseNames also unset) means the category can't be
   * matched at all, so it's shown as "unsupported" instead of a misleading
   * 0/N progress bar. */
  matchCourseTypes: string[] | null;
  /** Exact course names (department-mandated, e.g. "공학수학(1)") that count
   * toward this category regardless of their portal 과목종별 code — needed
   * because the portal tags the *same* course inconsistently across
   * semesters (e.g. 공학수학(1)/(2) show as 계기, 공학수학(3) shows as 전기). */
  matchCourseNames?: string[];
  /** Caveat shown under the progress bar even though the category is
   * "supported" — e.g. 대학교양(선택) counts credits but can't verify the
   * 4-영역 diversity requirement from course data alone. */
  caveatKr?: string;
  caveatEn?: string;
  /** 일반선택(자유선택): its earned credits are whatever's left after every
   * other category (in priority order) has claimed its courses. */
  leftover?: boolean;
  /** Hard cap at requiredCredits: e.g. 대학교양(선택) is "6개 영역 중 4개, 영역당
   * 3학점" -- credits beyond the 4x3=12 cap don't count toward this category,
   * they overflow into 일반선택 instead (see compare.ts). */
  capExcessToLeftover?: boolean;
  /** Area name -> course names, for categories that require diversity across
   * named areas (e.g. 대학교양(선택)'s 6개 영역). Sourced from the public
   * 학부대학 교양교육과정 pages (universitycollege.yonsei.ac.kr/uc/refinement/
   * course-necessary0N.do), not invented. */
  areaGroups?: Record<string, string[]>;
  /** How many distinct areaGroups keys must be covered (e.g. 4 of 6). */
  requiredAreaCount?: number;
}

export interface CategoryResult extends RequirementCategory {
  earnedCredits: number;
  supported: boolean;
  /** Distinct areaGroups keys the student's courses actually cover (only set
   * when the category has areaGroups). */
  completedAreas?: string[];
}

export interface ComparisonResult {
  categories: CategoryResult[];
  totalRequiredCredits: number | null;
  totalEarnedCredits: number;
  completedMandatoryCourses: string[];
  missingMandatoryCourses: string[];
  recommendations: Record<string, CourseOption[]>;
}
