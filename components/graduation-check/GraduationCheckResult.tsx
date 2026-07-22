"use client";

import { useEffect, useState } from "react";
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
    empty: "No cohort or course selections found. Please go back and select your cohort and courses first.",
    backToInput: "← Back to input",
  },
};

export default function GraduationCheckResult({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [entry, setEntry] = useState<GradEntry | null | undefined>(undefined);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    const state = loadState();
    const found = state.admissionSlug
      ? (gradRequirements as GradEntry[]).find((g) => g.slug === state.admissionSlug)
      : null;
    setEntry(found ?? null);
    if (found) {
      const allSelected = SEMESTER_KEYS.flatMap((k) => state.semesters[k]);
      setResult(compareRequirements(found, allSelected));
    }
  }, []);

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
              <span key={name} className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700">
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
                      className="rounded-full border border-line bg-surface-muted/60 px-3 py-1.5 text-sm text-ink/75"
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

      <Link
        href={localizePath("/undergraduate/graduation-check", lang)}
        className="mt-10 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t.backToInput}
      </Link>
    </section>
  );
}
