import type { GraduationCheckState, SemesterMap } from "./types";
import { SEMESTER_KEYS, STORAGE_KEY } from "./constants";

export function emptyState(): GraduationCheckState {
  const semesters = {} as SemesterMap;
  for (const key of SEMESTER_KEYS) semesters[key] = [];
  return { admissionSlug: null, semesters };
}

/** Reads saved input from localStorage only — this feature never sends
 * course-selection data to a server. Returns a fresh empty state on the
 * server, on first load, or if the saved value is missing/corrupt. */
export function loadState(): GraduationCheckState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<GraduationCheckState>;
    const base = emptyState();
    return {
      admissionSlug: parsed.admissionSlug ?? null,
      semesters: { ...base.semesters, ...(parsed.semesters ?? {}) },
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: GraduationCheckState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing / quota) — in-memory state still works for this session.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
