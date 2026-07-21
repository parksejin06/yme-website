import type { Lang } from "@/lib/nav";
import type { CurriculumEntry } from "@/components/academics/CourseExplorer";

/**
 * Row taxonomy for the curriculum map. Each row groups the real, official
 * `researchArea` values already present in curriculum.json (sourced from the
 * department's "교과목 체계도용 데이터" sheet) — no course is reclassified,
 * these are purely presentational groupings of existing official tags.
 * The one exception is "기초과학" (MSC), which has no researchArea in the
 * source data and is identified by category === "기초" instead.
 */
export interface FieldRow {
  key: string;
  labelKr: string;
  labelEn: string;
  color: string; // hex
  match: (entry: CurriculumEntry) => boolean;
}

export const FIELD_ROWS: FieldRow[] = [
  {
    key: "msc",
    labelKr: "기초과학",
    labelEn: "Basic Science",
    color: "#5b6472",
    match: (e) => e.category === "기초",
  },
  {
    key: "mechanics-materials",
    labelKr: "역학·재료",
    labelEn: "Mechanics & Materials",
    color: "#24406b",
    match: (e) => e.researchArea === "고체 및 재료",
  },
  {
    key: "thermal-fluids",
    labelKr: "열·유체·에너지",
    labelEn: "Thermal, Fluids & Energy",
    color: "#3f7268",
    match: (e) => e.researchArea === "열 및 에너지" || e.researchArea === "유체",
  },
  {
    key: "dynamics-control",
    labelKr: "동역학·제어·로봇",
    labelEn: "Dynamics, Control & Robotics",
    color: "#6a5a86",
    match: (e) => e.researchArea === "동역학 및 제어" || e.researchArea === "로봇 및 메카트로닉스",
  },
  {
    key: "design-manufacturing",
    labelKr: "설계·생산",
    labelEn: "Design & Manufacturing",
    color: "#a8583f",
    match: (e) => e.researchArea === "설계 및 생산",
  },
  {
    key: "experiment-research",
    labelKr: "실험·연구",
    labelEn: "Experiment & Research",
    color: "#a07d3a",
    match: (e) => e.researchArea === "연구 및 설계 프로젝트",
  },
  {
    key: "applied-convergence",
    labelKr: "응용·융합",
    labelEn: "Applied & Convergence",
    color: "#4f7a5c",
    match: (e) =>
      ["바이오·의료", "마이크로·나노", "광학 및 정밀계측", "컴퓨터·수치해석"].includes(e.researchArea ?? ""),
  },
];

export function rowForEntry(entry: CurriculumEntry): FieldRow {
  return FIELD_ROWS.find((r) => r.match(entry)) ?? FIELD_ROWS[FIELD_ROWS.length - 1];
}

export const MAP_YEAR_GROUPS: { key: string; labelKr: string; labelEn: string }[] = [
  { key: "1", labelKr: "1학년", labelEn: "Year 1" },
  { key: "2", labelKr: "2학년", labelEn: "Year 2" },
  { key: "34", labelKr: "3·4학년", labelEn: "Year 3–4" },
  { key: "4", labelKr: "4학년", labelEn: "Year 4" },
];

export const MAP_COLUMNS: { bucket: string; labelKr: string; labelEn: string; yearGroup: string }[] = [
  { bucket: "1-1", labelKr: "1학년 1학기", labelEn: "Y1 · S1", yearGroup: "1" },
  { bucket: "1-2", labelKr: "1학년 2학기", labelEn: "Y1 · S2", yearGroup: "1" },
  { bucket: "2-1", labelKr: "2학년 1학기", labelEn: "Y2 · S1", yearGroup: "2" },
  { bucket: "2-2", labelKr: "2학년 2학기", labelEn: "Y2 · S2", yearGroup: "2" },
  { bucket: "34-1", labelKr: "3·4학년 1학기", labelEn: "Y3–4 · S1", yearGroup: "34" },
  { bucket: "34-2", labelKr: "3·4학년 2학기", labelEn: "Y3–4 · S2", yearGroup: "34" },
  { bucket: "4-1", labelKr: "4학년 1학기", labelEn: "Y4 · S1", yearGroup: "4" },
  { bucket: "4-2", labelKr: "4학년 2학기", labelEn: "Y4 · S2", yearGroup: "4" },
];

/** Real, documented thematic relations from courses.json's relatedCourses notes
 * (never an official prerequisite — the source data confirms none exist). Used
 * only to cross-highlight courses when one of them is selected. */
export const RELATED_COURSE_PAIRS: [string, string][] = [
  ["MEU2300", "MEU4300"], // 기계공학창의설계 <-> 창의제품설계 (설계 교과 계열)
  ["MEU4400", "MEU3006"], // 연구논문 <-> 학부연구(1)
  ["MEU4400", "MEU3007"], // 연구논문 <-> 학부연구(2)
];

export function relatedCodesFor(courseCode: string): string[] {
  return RELATED_COURSE_PAIRS.filter(([a, b]) => a === courseCode || b === courseCode).map(([a, b]) =>
    a === courseCode ? b : a
  );
}

export function rowLabel(row: FieldRow, lang: Lang): string {
  return lang === "ko" ? row.labelKr : row.labelEn;
}
