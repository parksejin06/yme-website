import type { SemesterKey } from "./types";

/** All semesters in academic order (1학기 → 여름 → 2학기 → 겨울) per year. */
export const SEMESTER_KEYS: SemesterKey[] = [
  "1-1", "1-su", "1-2", "1-wi",
  "2-1", "2-su", "2-2", "2-wi",
  "3-1", "3-su", "3-2", "3-wi",
  "4-1", "4-su", "4-2", "4-wi",
];

/** The 8 regular semesters — the default tab set before 계절학기 is revealed. */
export const REGULAR_SEMESTER_KEYS: SemesterKey[] = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];

export const SEMESTER_LABELS: Record<SemesterKey, { ko: string; en: string }> = {
  "1-1": { ko: "1학년 1학기", en: "Year 1 · Sem 1" },
  "1-su": { ko: "1학년 여름", en: "Year 1 · Summer" },
  "1-2": { ko: "1학년 2학기", en: "Year 1 · Sem 2" },
  "1-wi": { ko: "1학년 겨울", en: "Year 1 · Winter" },
  "2-1": { ko: "2학년 1학기", en: "Year 2 · Sem 1" },
  "2-su": { ko: "2학년 여름", en: "Year 2 · Summer" },
  "2-2": { ko: "2학년 2학기", en: "Year 2 · Sem 2" },
  "2-wi": { ko: "2학년 겨울", en: "Year 2 · Winter" },
  "3-1": { ko: "3학년 1학기", en: "Year 3 · Sem 1" },
  "3-su": { ko: "3학년 여름", en: "Year 3 · Summer" },
  "3-2": { ko: "3학년 2학기", en: "Year 3 · Sem 2" },
  "3-wi": { ko: "3학년 겨울", en: "Year 3 · Winter" },
  "4-1": { ko: "4학년 1학기", en: "Year 4 · Sem 1" },
  "4-su": { ko: "4학년 여름", en: "Year 4 · Summer" },
  "4-2": { ko: "4학년 2학기", en: "Year 4 · Sem 2" },
  "4-wi": { ko: "4학년 겨울", en: "Year 4 · Winter" },
};

export const STORAGE_KEY = "me-graduation-check-v1";
export const RECOMMENDATION_LIMIT = 5;
