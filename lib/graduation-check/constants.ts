import type { SemesterKey } from "./types";

export const SEMESTER_KEYS: SemesterKey[] = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];

export const SEMESTER_LABELS: Record<SemesterKey, { ko: string; en: string }> = {
  "1-1": { ko: "1학년 1학기", en: "Year 1 · Sem 1" },
  "1-2": { ko: "1학년 2학기", en: "Year 1 · Sem 2" },
  "2-1": { ko: "2학년 1학기", en: "Year 2 · Sem 1" },
  "2-2": { ko: "2학년 2학기", en: "Year 2 · Sem 2" },
  "3-1": { ko: "3학년 1학기", en: "Year 3 · Sem 1" },
  "3-2": { ko: "3학년 2학기", en: "Year 3 · Sem 2" },
  "4-1": { ko: "4학년 1학기", en: "Year 4 · Sem 1" },
  "4-2": { ko: "4학년 2학기", en: "Year 4 · Sem 2" },
};

export const STORAGE_KEY = "me-graduation-check-v1";
export const RECOMMENDATION_LIMIT = 5;
