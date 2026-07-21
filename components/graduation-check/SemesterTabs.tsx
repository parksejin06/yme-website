"use client";

import { SEMESTER_KEYS, SEMESTER_LABELS } from "@/lib/graduation-check/constants";
import type { SemesterKey, SemesterMap } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

export default function SemesterTabs({
  active,
  onChange,
  semesters,
  lang,
}: {
  active: SemesterKey;
  onChange: (key: SemesterKey) => void;
  semesters: SemesterMap;
  lang: Lang;
}) {
  return (
    <div role="tablist" aria-label={lang === "ko" ? "학기 선택" : "Select semester"} className="flex flex-wrap gap-1.5">
      {SEMESTER_KEYS.map((key) => {
        const credits = semesters[key].reduce((sum, c) => sum + c.credit, 0);
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`flex min-h-11 flex-col items-center rounded-md px-4 py-1.5 transition-colors ${
              isActive ? "bg-primary text-white" : "border border-line text-ink/70 hover:border-primary-soft"
            }`}
          >
            <span className="font-display text-sm">{SEMESTER_LABELS[key][lang]}</span>
            <span className={`text-[11px] ${isActive ? "text-white/70" : "text-ink/40"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
              {credits}
              {lang === "ko" ? "학점" : " cr"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
