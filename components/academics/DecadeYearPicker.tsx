"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TabRow from "@/components/ui/TabRow";
import { DECADES, groupsForDecade, academicsPath, type Lang } from "@/lib/academics";

export default function DecadeYearPicker({ lang }: { lang: Lang }) {
  const [activeDecade, setActiveDecade] = useState(DECADES[0].slug);
  const router = useRouter();
  const years = groupsForDecade(activeDecade);

  return (
    <div>
      {/* Desktop / tablet: two-step flat tab UI */}
      <div className="hidden sm:block">
        <TabRow
          ariaLabel={lang === "ko" ? "학번 시대 선택" : "Select cohort decade"}
          value={activeDecade}
          onChange={(v) => setActiveDecade(v as typeof activeDecade)}
          items={DECADES.map((d) => ({
            value: d.slug,
            label: `${lang === "ko" ? d.labelKr : d.labelEn} (${lang === "ko" ? d.rangeKr : d.rangeEn})`,
          }))}
        />

        <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line pb-5">
          <span className="text-sm font-medium text-ink/45">{lang === "ko" ? "세부 학번" : "Cohort"}</span>
          {years.map((y) => (
            <Link
              key={y.slug}
              href={academicsPath(lang, activeDecade, y.slug)}
              className="min-h-11 text-[15px] font-medium text-ink/75 underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-primary hover:decoration-primary"
            >
              {lang === "ko" ? y.labelKr : y.labelEn}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: two cascading dropdowns */}
      <div className="grid gap-3 sm:hidden">
        <label className="text-sm text-ink/70">
          {lang === "ko" ? "학번 시대" : "Cohort decade"}
          <select
            value={activeDecade}
            onChange={(e) => setActiveDecade(e.target.value as typeof activeDecade)}
            className="mt-1 block h-14 w-full rounded-md border border-line px-3 text-ink"
          >
            {DECADES.map((d) => (
              <option key={d.slug} value={d.slug}>
                {lang === "ko" ? d.labelKr : d.labelEn} ({lang === "ko" ? d.rangeKr : d.rangeEn})
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-ink/70">
          {lang === "ko" ? "학번" : "Cohort"}
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) router.push(academicsPath(lang, activeDecade, e.target.value));
            }}
            className="mt-1 block h-14 w-full rounded-md border border-line px-3 text-ink"
          >
            <option value="" disabled>
              {lang === "ko" ? "선택하세요" : "Select…"}
            </option>
            {years.map((y) => (
              <option key={y.slug} value={y.slug}>
                {lang === "ko" ? y.labelKr : y.labelEn}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
