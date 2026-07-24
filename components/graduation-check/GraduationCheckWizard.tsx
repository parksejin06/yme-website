"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import AdmissionYearSelect from "./AdmissionYearSelect";
import SemesterTabs from "./SemesterTabs";
import SemesterCourseList from "./SemesterCourseList";
import CourseSearchCombobox from "./CourseSearchCombobox";
import TranscriptImport from "./TranscriptImport";
import ManualCourseAdd from "./ManualCourseAdd";
import { emptyState, loadState, saveState, clearState } from "@/lib/graduation-check/storage";
import { SEMESTER_KEYS } from "@/lib/graduation-check/constants";
import { slugForAdmissionYear } from "@/lib/graduation-check/transcript-parser";
import type { GraduationCheckState, SemesterKey, SemesterMap, CourseOption } from "@/lib/graduation-check/types";
import { localizePath, type Lang } from "@/lib/nav";

const COPY = {
  ko: {
    admissionLabel: "1) 입학년도(학번) 선택",
    semesterLabel: "2) 학기별 수강 과목 입력",
    addLabel: "과목 검색",
    total: "전체 선택 학점",
    reset: "전체 초기화",
    resetConfirm: "입력한 내용을 모두 지울까요? 이 작업은 되돌릴 수 없습니다.",
    result: "결과 확인하기",
    needYear: "결과를 확인하려면 먼저 학번을 선택해주세요.",
  },
  en: {
    admissionLabel: "1) Select your admission cohort",
    semesterLabel: "2) Enter courses taken each semester",
    addLabel: "Search courses",
    total: "Total credits selected",
    reset: "Reset all",
    resetConfirm: "Clear everything you've entered? This can't be undone.",
    result: "See my results",
    needYear: "Please select your cohort before viewing results.",
  },
};

function noopSubscribe() {
  return () => {};
}

export default function GraduationCheckWizard({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const router = useRouter();
  const [state, setState] = useState<GraduationCheckState>(emptyState);
  const [activeSemester, setActiveSemester] = useState<SemesterKey>("1-1");
  const [hydrated, setHydrated] = useState(false);

  // loadState() reads localStorage, which doesn't exist during server rendering,
  // so getServerSnapshot returns null there (and on the client's first hydration
  // pass, to match) -- getSnapshot is memoized in the ref so it keeps returning
  // the same reference once computed. Once the real value shows up post-hydration,
  // it's copied into `state` below via React's "adjusting state during render"
  // pattern instead of an effect, so it counts as a derived update rather than
  // the setState-in-effect anti-pattern.
  const loadedRef = useRef<GraduationCheckState | null>(null);
  const loaded = useSyncExternalStore(
    noopSubscribe,
    () => (loadedRef.current ??= loadState()),
    () => null
  );
  if (loaded !== null && !hydrated) {
    setState(loaded);
    setHydrated(true);
  }

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  function addCourse(course: CourseOption) {
    setState((s) => ({
      ...s,
      semesters: { ...s.semesters, [activeSemester]: [...s.semesters[activeSemester], course] },
    }));
  }

  function removeCourse(code: string) {
    setState((s) => ({
      ...s,
      semesters: { ...s.semesters, [activeSemester]: s.semesters[activeSemester].filter((c) => c.courseCode !== code) },
    }));
  }

  function handleReset() {
    if (!window.confirm(t.resetConfirm)) return;
    clearState();
    setState(emptyState());
  }

  function handleImport(semesters: SemesterMap, admissionYear: number | null) {
    const slug = admissionYear != null ? slugForAdmissionYear(admissionYear) : null;
    setState((s) => ({ admissionSlug: slug ?? s.admissionSlug, semesters }));
  }

  const hasAnyCourses = SEMESTER_KEYS.some((k) => state.semesters[k].length > 0);

  const totalCredits = SEMESTER_KEYS.reduce((sum, k) => sum + state.semesters[k].reduce((s2, c) => s2 + c.credit, 0), 0);
  const currentCourses = state.semesters[activeSemester];

  return (
    <div className="space-y-10">
      <TranscriptImport lang={lang} hasExistingCourses={hasAnyCourses} onImport={handleImport} />

      <div>
        <h2 className="font-display text-lg text-ink">{t.admissionLabel}</h2>
        <div className="mt-3">
          <AdmissionYearSelect
            value={state.admissionSlug}
            onChange={(slug) => setState((s) => ({ ...s, admissionSlug: slug }))}
            lang={lang}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink">{t.semesterLabel}</h2>
        <div className="mt-4">
          <SemesterTabs active={activeSemester} onChange={setActiveSemester} semesters={state.semesters} lang={lang} />
        </div>

        <div className="mt-5 rounded-lg border border-line bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{t.addLabel}</p>
          <div className="mt-2">
            <CourseSearchCombobox onSelect={addCourse} excludeCodes={currentCourses.map((c) => c.courseCode)} lang={lang} />
          </div>
          <ManualCourseAdd lang={lang} onAdd={addCourse} />
          <SemesterCourseList courses={currentCourses} onRemove={removeCourse} lang={lang} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface-muted/60 p-5">
        <div>
          <p className="text-xs text-ink/45">{t.total}</p>
          <p className="mt-1 font-display text-2xl text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
            {totalCredits}
            {lang === "ko" ? "학점" : " credits"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleReset} className="text-sm font-medium text-ink/50 hover:text-ink">
            {t.reset}
          </button>
          <button
            type="button"
            disabled={!state.admissionSlug}
            onClick={() => router.push(localizePath("/undergraduate/graduation-check/result", lang))}
            className="rounded-sm bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            {t.result}
          </button>
        </div>
      </div>
      {!state.admissionSlug && <p className="text-right text-xs text-ink/40">{t.needYear}</p>}
    </div>
  );
}
