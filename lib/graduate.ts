import type { Lang } from "@/lib/nav";

export interface GraduateCourse {
  courseCode: string;
  nameKr: string;
  nameEn: string | null;
  credit: number;
  researchArea: string | null;
}

export const RESEARCH_AREAS: { key: string; labelKr: string; labelEn: string }[] = [
  { key: "mechanics-materials", labelKr: "역학·재료", labelEn: "Mechanics & Materials" },
  { key: "thermal-energy", labelKr: "열·에너지", labelEn: "Thermal & Energy" },
  { key: "fluids", labelKr: "유체", labelEn: "Fluids" },
  { key: "dynamics-control", labelKr: "동역학·제어", labelEn: "Dynamics & Control" },
  { key: "robotics", labelKr: "로봇", labelEn: "Robotics" },
  { key: "manufacturing-design", labelKr: "생산·설계", labelEn: "Manufacturing & Design" },
  { key: "micro-nano", labelKr: "마이크로·나노", labelEn: "Micro/Nano" },
  { key: "bio", labelKr: "바이오", labelEn: "Bio" },
  { key: "optics", labelKr: "광학", labelEn: "Optics" },
];

export function researchAreaLabel(key: string | null, lang: Lang): string | null {
  if (!key) return null;
  const area = RESEARCH_AREAS.find((a) => a.key === key);
  return area ? (lang === "ko" ? area.labelKr : area.labelEn) : null;
}

export const PROGRAM_META: Record<string, { labelKr: string; labelEn: string }> = {
  master: { labelKr: "석사", labelEn: "Master's" },
  phd: { labelKr: "박사", labelEn: "Doctoral" },
  integrated: { labelKr: "석·박사 통합", labelEn: "Combined" },
};

/**
 * Maps a graduate-course research-area tag (course-name-derived, see graduate-courses.json)
 * to the faculty "field" taxonomy used in faculty.json (official, from the department roster).
 * Grouping by broad technical domain only — not a claim of specific advisor/course links.
 */
export const RESEARCH_AREA_TO_FACULTY_FIELD: Record<string, string> = {
  "mechanics-materials": "역학·소재",
  "thermal-energy": "에너지·열유체",
  "fluids": "에너지·열유체",
  "dynamics-control": "로보틱스·제어",
  "robotics": "로보틱스·제어",
  "manufacturing-design": "설계·제조",
  "micro-nano": "마이크로·나노",
  "bio": "바이오·포토닉스",
  "optics": "바이오·포토닉스",
};
