"use client";

import { useState } from "react";
import { PROGRAM_LABEL, type ThesisReview } from "@/lib/community";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    category: "구분",
    program: "과정",
    title: "제목",
    targetSemester: "대상 학기",
    period: "신청 기간",
    postedDate: "게시일",
    noResults: "게시된 공고가 없습니다.",
  },
  en: {
    all: "All",
    category: "Category",
    program: "Program",
    title: "Title",
    targetSemester: "Target Semester",
    period: "Application Period",
    postedDate: "Posted",
    noResults: "No notices posted.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function ThesisReviewBoard({ items, lang }: { items: ThesisReview[]; lang: Lang }) {
  const t = COPY[lang];
  const [programFilter, setProgramFilter] = useState<ThesisReview["program"] | "all">("all");

  const filtered = items.filter((i) => programFilter === "all" || i.program === programFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setProgramFilter("all")} className={chipClass(programFilter === "all")}>
          {t.all}
        </button>
        {(Object.keys(PROGRAM_LABEL) as ThesisReview["program"][]).map((p) => (
          <button key={p} onClick={() => setProgramFilter(p)} className={chipClass(programFilter === p)}>
            {PROGRAM_LABEL[p][lang]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-muted text-left">
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.category}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.program}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.title}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.targetSemester}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.period}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">{t.postedDate}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-line hover:bg-surface-muted/60">
                  <td className="px-4 py-3.5 text-ink/70">{i.category}</td>
                  <td className="px-4 py-3.5 text-ink/70">{PROGRAM_LABEL[i.program][lang]}</td>
                  <td className="px-4 py-3.5 text-ink">{i.title}</td>
                  <td className="px-4 py-3.5 text-ink/70">{i.targetSemester}</td>
                  <td className="px-4 py-3.5 text-ink/70">
                    {i.periodStart ? `${i.periodStart} ~ ${i.periodEnd ?? ""}` : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-ink/50">{i.postedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
