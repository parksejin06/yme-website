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
  /** courseType values in the course data that count toward this category.
   * null means the category can't be matched against any known courseType
   * (data doesn't distinguish it), so it's shown as "unsupported" instead of
   * a misleading 0/N progress bar. */
  matchCourseTypes: string[] | null;
  /** 일반선택(자유선택): its earned credits are the leftover — every earned
   * credit not counted by any other category — rather than a courseType match. */
  leftover?: boolean;
}

export interface CategoryResult extends RequirementCategory {
  earnedCredits: number;
  supported: boolean;
}

export interface ComparisonResult {
  categories: CategoryResult[];
  totalRequiredCredits: number | null;
  totalEarnedCredits: number;
  completedMandatoryCourses: string[];
  missingMandatoryCourses: string[];
  recommendations: Record<string, CourseOption[]>;
}
