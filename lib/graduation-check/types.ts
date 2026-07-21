export type SemesterKey = "1-1" | "1-2" | "2-1" | "2-2" | "3-1" | "3-2" | "4-1" | "4-2";

export interface CourseOption {
  courseCode: string;
  nameKr: string;
  nameEn: string | null;
  courseType: string; // "전필" | "전선" | "대교"
  credit: number;
  status: "confirmed" | "draft";
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
