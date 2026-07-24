"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { loadState } from "@/lib/graduation-check/storage";
import { compareRequirements } from "@/lib/graduation-check/compare";
import { SEMESTER_KEYS } from "@/lib/graduation-check/constants";
import gradRequirements from "@/data/graduation-requirements.json";
import { localizePath, type Lang } from "@/lib/nav";
import type { ComparisonResult } from "@/lib/graduation-check/types";

type GradEntry = (typeof gradRequirements)[number];

const COPY = {
  ko: {
    disclaimer: "본 기능은 참고용이며 실제 졸업요건은 학사팀 공식 확인이 필요합니다.",
    title: "졸업요건 자가진단 결과",
    overall: "전체 졸업 학점",
    unsupported: "이 항목은 현재 과목 데이터로는 자동 확인이 어렵습니다. 학과 확인이 필요합니다.",
    missingMandatory: "아직 이수하지 않은 필수 과목",
    recommendTitle: "부족한 학점을 채우려면?",
    draftShort: "확인 필요",
    rulesTitle: "이 학번의 세부 이수 규정",
    rulesIntro: "학점 수 외에 반드시 확인해야 할 규정입니다. 과목명 기반 자동 확인이 어려워 규정 원문을 안내합니다.",
    freeElectiveNote: "일반선택은 전공·교양 어디에도 배정되지 않은 학점의 합계입니다. 특정 과목의 인정 영역은 학사팀 확인이 필요합니다.",
    areaDone: "완료",
    areaMissing: "미이수",
    areaCount: (done: number, required: number) => `${done}/${required}개 영역 완료`,
    empty: "입력된 학번 또는 과목 정보가 없습니다. 먼저 자가진단 입력 화면에서 학번과 수강 과목을 선택해주세요.",
    backToInput: "← 입력 화면으로 돌아가기",
  },
  en: {
    disclaimer: "This tool is for reference only — official graduation requirements must be confirmed with the Academic Affairs team.",
    title: "Graduation Requirement Check Results",
    overall: "Total graduation credits",
    unsupported: "This category can't be checked automatically with current course data. Please confirm with the department.",
    missingMandatory: "Required courses not yet completed",
    recommendTitle: "Need more credits?",
    draftShort: "Unverified",
    rulesTitle: "Detailed requirements for your cohort",
    rulesIntro: "Rules beyond credit counts that you must verify. These can't be auto-checked from course names, so the original text is shown.",
    freeElectiveNote: "Free electives are the sum of credits not assigned to any major or liberal-arts category. Confirm how specific courses count with the Academic Affairs team.",
    areaDone: "Done",
    areaMissing: "Not yet",
    areaCount: (done: number, required: number) => `${done}/${required} areas completed`,
    empty: "No cohort or course selections found. Please go back and select your cohort and courses first.",
    backToInput: "← Back to input",
  },
};

interface LoadedCheck {
  /** undefined = not loaded yet (server render / pre-hydration); null = loaded
   * but no cohort saved; GradEntry = loaded with a matching cohort. */
  entry: GradEntry | null | undefined;
  result: ComparisonResult | null;
}

/** loadState() reads localStorage, which only exists client-side, so the saved
 * cohort/courses can't be known during server rendering -- getServerSnapshot
 * below returns this "not loaded yet" value to match what the server (and the
 * client's first hydration pass) render, avoiding a hydration mismatch. */
const SERVER_SNAPSHOT: LoadedCheck = { entry: undefined, result: null };

function noopSubscribe() {
  return () => {};
}

function computeLoadedCheck(): LoadedCheck {
  const saved = loadState();
  const found = saved.admissionSlug
    ? ((gradRequirements as GradEntry[]).find((g) => g.slug === saved.admissionSlug) ?? null)
    : null;
  const result = found ? compareRequirements(found, SEMESTER_KEYS.flatMap((k) => saved.semesters[k])) : null;
  return { entry: found, result };
}

export default function GraduationCheckResult({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  // Computed once per mount (lazily, on first read) and cached in the ref so
  // useSyncExternalStore's getSnapshot keeps returning the same reference --
  // this is the "read an external, browser-only store safely" pattern React
  // recommends in place of loading state via a plain useEffect + setState.
  const snapshotRef = useRef<LoadedCheck | null>(null);
  const loaded = useSyncExternalStore(
    noopSubscribe,
    () => (snapshotRef.current ??= computeLoadedCheck()),
    () => SERVER_SNAPSHOT
  );

  const { entry, result } = loaded;
  if (entry === undefined) return null;

  if (!entry || !result) {
    return (
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-sm text-ink/60">{t.empty}</p>
        <Link
          href={localizePath("/undergraduate/graduation-check", lang)}
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t.backToInput}
        </Link>
      </section>
    );
  }

  const recommendedCategories = result.categories.filter((cat) => result.recommendations[cat.key]?.length);

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-900">{t.disclaimer}</p>
      </div>

      <h1 className="mt-8 font-display text-2xl text-ink">
        {entry.label} · {t.title}
      </h1>

      {result.totalRequiredCredits != null && (
        <div className="mt-6">
          <ProgressBar
            earned={result.totalEarnedCredits}
            required={result.totalRequiredCredits}
            label={`${t.overall} (${result.totalEarnedCredits}/${result.totalRequiredCredits})`}
          />
        </div>
      )}

      <div className="mt-8 divide-y divide-line border-y border-line">
        {result.categories.map((cat) => (
          <div key={cat.key} className="py-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-sm text-ink">{lang === "ko" ? cat.labelKr : cat.labelEn}</p>
              {cat.supported && cat.requiredCredits != null && (
                <p className="shrink-0 text-xs text-ink/50" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {cat.earnedCredits} / {cat.requiredCredits} {lang === "ko" ? "학점" : "credits"}
                </p>
              )}
            </div>
            {cat.supported && cat.requiredCredits != null ? (
              <div className="mt-3">
                <ProgressBar earned={cat.earnedCredits} required={cat.requiredCredits} />
                {cat.leftover && <p className="mt-2 text-xs text-ink/45">{t.freeElectiveNote}</p>}
                {cat.areaGroups && cat.requiredAreaCount != null && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-ink/60">
                      {t.areaCount(cat.completedAreas?.length ?? 0, cat.requiredAreaCount)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.keys(cat.areaGroups).map((area) => {
                        const done = cat.completedAreas?.includes(area) ?? false;
                        return (
                          <span
                            key={area}
                            className={`rounded-sm border px-2.5 py-1 text-xs ${
                              done ? "border-primary/30 bg-primary/5 text-primary" : "border-line text-ink/40"
                            }`}
                          >
                            {area} · {done ? t.areaDone : t.areaMissing}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {(cat.caveatKr || cat.caveatEn) && (
                  <p className="mt-2 text-xs text-amber-700">{lang === "ko" ? cat.caveatKr : cat.caveatEn}</p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink/40">{t.unsupported}</p>
            )}
          </div>
        ))}
      </div>

      {result.missingMandatoryCourses.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg text-ink">{t.missingMandatory}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.missingMandatoryCourses.map((name) => (
              <span key={name} className="rounded-sm border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendedCategories.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg text-ink">{t.recommendTitle}</h2>
          <div className="mt-4 space-y-5">
            {recommendedCategories.map((cat) => (
              <div key={cat.key}>
                <p className="text-sm font-medium text-ink/70">{lang === "ko" ? cat.labelKr : cat.labelEn}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.recommendations[cat.key].map((c) => (
                    <span
                      key={c.courseCode}
                      className="rounded-sm border border-line bg-surface-muted/60 px-3 py-1.5 text-sm text-ink/75"
                    >
                      {c.nameKr} · {c.credit}
                      {lang === "ko" ? "학점" : "cr"}
                      {c.status === "draft" && <span className="ml-1 text-amber-600">({t.draftShort})</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lang === "ko" && Array.isArray(entry.specialNotes) && entry.specialNotes.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="font-display text-lg text-ink">{t.rulesTitle}</h2>
          <p className="mt-1.5 text-sm text-ink/55">{t.rulesIntro}</p>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            {entry.specialNotes.map((note, i) => (
              <div key={i} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="font-display text-sm text-primary">{note.category}</dt>
                <dd className="text-sm leading-relaxed text-ink/70">{note.content}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <Link
        href={localizePath("/undergraduate/graduation-check", lang)}
        className="mt-10 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t.backToInput}
      </Link>
    </section>
  );
}
