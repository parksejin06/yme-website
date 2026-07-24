"use client";

import { useState } from "react";
import { SEMESTER_KEYS, REGULAR_SEMESTER_KEYS, SEMESTER_LABELS } from "@/lib/graduation-check/constants";
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
  // 계절학기 tabs stay hidden until toggled — but always show any that
  // already hold courses (e.g. after a transcript import).
  const [showSeasonal, setShowSeasonal] = useState(false);
  const isSeasonal = (key: SemesterKey) => key.endsWith("-su") || key.endsWith("-wi");
  const anySeasonalFilled = SEMESTER_KEYS.some((k) => isSeasonal(k) && semesters[k].length > 0);
  const seasonalVisible = showSeasonal || anySeasonalFilled;

  const visibleKeys = seasonalVisible ? SEMESTER_KEYS : REGULAR_SEMESTER_KEYS;

  function hideSeasonal() {
    if (isSeasonal(active)) onChange("1-1");
    setShowSeasonal(false);
  }

  return (
    <div>
      <div role="tablist" aria-label={lang === "ko" ? "학기 선택" : "Select semester"} className="flex flex-wrap gap-1.5">
        {visibleKeys.map((key) => {
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
      {!seasonalVisible ? (
        <button
          type="button"
          onClick={() => setShowSeasonal(true)}
          className="mt-2.5 text-sm font-medium text-primary hover:underline"
        >
          {lang === "ko" ? "+ 계절학기 추가" : "+ Add summer/winter sessions"}
        </button>
      ) : (
        !anySeasonalFilled && (
          <button
            type="button"
            onClick={hideSeasonal}
            className="mt-2.5 text-sm font-medium text-ink/50 hover:text-ink"
          >
            {lang === "ko" ? "계절학기 숨기기" : "Hide summer/winter sessions"}
          </button>
        )
      )}
    </div>
  );
}
