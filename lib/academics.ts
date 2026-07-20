export type Lang = "ko" | "en";

export interface StudentGroupMeta {
  studentYear: string;
  slug: string;
  labelKr: string;
  labelEn: string;
  decade: "2000s" | "2010s" | "2020s" | "other";
}

export const STUDENT_GROUPS: StudentGroupMeta[] = [
  { studentYear: "03-05", slug: "03-05", labelKr: "03~05학번", labelEn: "Class of ’03–’05", decade: "2000s" },
  { studentYear: "06-09", slug: "06-09", labelKr: "06~09학번", labelEn: "Class of ’06–’09", decade: "2000s" },
  { studentYear: "10-12", slug: "10-12", labelKr: "10~12학번", labelEn: "Class of ’10–’12", decade: "2010s" },
  { studentYear: "13-14", slug: "13-14", labelKr: "13~14학번", labelEn: "Class of ’13–’14", decade: "2010s" },
  { studentYear: "15-17", slug: "15-17", labelKr: "15~17학번", labelEn: "Class of ’15–’17", decade: "2010s" },
  { studentYear: "18", slug: "18", labelKr: "18학번", labelEn: "Class of ’18", decade: "2010s" },
  { studentYear: "19", slug: "19", labelKr: "19학번", labelEn: "Class of ’19", decade: "2010s" },
  { studentYear: "20", slug: "20", labelKr: "20학번", labelEn: "Class of ’20", decade: "2020s" },
  { studentYear: "21", slug: "21", labelKr: "21학번", labelEn: "Class of ’21", decade: "2020s" },
  { studentYear: "22", slug: "22", labelKr: "22학번", labelEn: "Class of ’22", decade: "2020s" },
  { studentYear: "23", slug: "23", labelKr: "23학번", labelEn: "Class of ’23", decade: "2020s" },
  { studentYear: "24", slug: "24", labelKr: "24학번", labelEn: "Class of ’24", decade: "2020s" },
  { studentYear: "25", slug: "25", labelKr: "25학번", labelEn: "Class of ’25", decade: "2020s" },
  { studentYear: "transfer_admission", slug: "transfer-admission", labelKr: "학사편입", labelEn: "Transfer Admission", decade: "other" },
  { studentYear: "expected_double_major", slug: "expected-double-major", labelKr: "졸업예정자 복수전공", labelEn: "Graduating Double-Major Students", decade: "other" },
];

export const DECADES: {
  slug: "2000s" | "2010s" | "2020s" | "other";
  labelKr: string;
  rangeKr: string;
  labelEn: string;
  rangeEn: string;
}[] = [
  { slug: "2000s", labelKr: "00년대 학번", rangeKr: "03~09학번", labelEn: "2000s", rangeEn: "Class of ’03–’09" },
  { slug: "2010s", labelKr: "10년대 학번", rangeKr: "10~19학번", labelEn: "2010s", rangeEn: "Class of ’10–’19" },
  { slug: "2020s", labelKr: "20년대 학번", rangeKr: "20~25학번", labelEn: "2020s", rangeEn: "Class of ’20–’25" },
  { slug: "other", labelKr: "기타", rangeKr: "학사편입 · 졸업예정자 복수전공", labelEn: "Other", rangeEn: "Transfer admission & double-major" },
];

export function groupsForDecade(decade: string) {
  return STUDENT_GROUPS.filter((g) => g.decade === decade);
}

export function findGroupBySlug(slug: string) {
  return STUDENT_GROUPS.find((g) => g.slug === slug);
}

export function academicsPath(lang: Lang, decade?: string, yearSlug?: string) {
  const base = lang === "ko" ? "/undergraduate/graduation" : "/en/undergraduate/graduation";
  if (!decade) return base;
  if (!yearSlug) return `${base}/${decade}`;
  return `${base}/${decade}/${yearSlug}`;
}

/** Year groups as they actually appear in curriculum bucket keys ("34" = combined 3rd/4th-year offering). */
export const YEAR_GROUPS: { key: string; labelKr: string; labelEn: string }[] = [
  { key: "1", labelKr: "1학년", labelEn: "Year 1" },
  { key: "2", labelKr: "2학년", labelEn: "Year 2" },
  { key: "34", labelKr: "3·4학년", labelEn: "Year 3–4" },
  { key: "4", labelKr: "4학년", labelEn: "Year 4" },
];

export const SEMESTERS: { key: string; labelKr: string; labelEn: string }[] = [
  { key: "1", labelKr: "1학기", labelEn: "Semester 1" },
  { key: "2", labelKr: "2학기", labelEn: "Semester 2" },
];

/** courseType codes from the source spreadsheet: 전필=Major Required, 전선=Major Elective, 대교=University Liberal Arts. */
export const COURSE_TYPES: { key: string; labelKr: string; labelEn: string; badgeClass: string }[] = [
  { key: "전필", labelKr: "전공필수", labelEn: "Major Required", badgeClass: "bg-primary text-white" },
  {
    key: "전선",
    labelKr: "전공선택",
    labelEn: "Major Elective",
    badgeClass: "bg-primary-soft/15 text-primary-strong ring-1 ring-inset ring-primary-soft/30",
  },
  {
    key: "대교",
    labelKr: "대학교양",
    labelEn: "University Liberal Arts",
    badgeClass: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  },
];

export function courseTypeMeta(key: string) {
  return COURSE_TYPES.find((t) => t.key === key);
}

export function yearLabelFromBucket(bucket: string, lang: Lang): string {
  const [y] = bucket.split("-");
  const g = YEAR_GROUPS.find((g) => g.key === y);
  return g ? (lang === "ko" ? g.labelKr : g.labelEn) : y;
}

export function semesterLabelFromBucket(bucket: string, lang: Lang): string {
  const [, s] = bucket.split("-");
  const g = SEMESTERS.find((g) => g.key === s);
  return g ? (lang === "ko" ? g.labelKr : g.labelEn) : s;
}
