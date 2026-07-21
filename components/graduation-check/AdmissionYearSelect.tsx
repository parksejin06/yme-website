"use client";

import { STUDENT_GROUPS, DECADES } from "@/lib/academics";
import type { Lang } from "@/lib/nav";

export default function AdmissionYearSelect({
  value,
  onChange,
  lang,
}: {
  value: string | null;
  onChange: (slug: string) => void;
  lang: Lang;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-11 w-full max-w-xs rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-primary focus:outline-none sm:w-auto"
    >
      <option value="" disabled>
        {lang === "ko" ? "학번(또는 유형) 선택" : "Select your cohort"}
      </option>
      {DECADES.map((d) => {
        const groups = STUDENT_GROUPS.filter((g) => g.decade === d.slug);
        if (groups.length === 0) return null;
        return (
          <optgroup key={d.slug} label={lang === "ko" ? `${d.labelKr} (${d.rangeKr})` : `${d.labelEn} (${d.rangeEn})`}>
            {groups.map((g) => (
              <option key={g.slug} value={g.slug}>
                {lang === "ko" ? g.labelKr : g.labelEn}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
