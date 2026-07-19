"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DECADES, groupsForDecade, academicsPath, type Lang } from "@/lib/academics";

export default function DecadeYearPicker({ lang }: { lang: Lang }) {
  const [activeDecade, setActiveDecade] = useState(DECADES[0].slug);
  const router = useRouter();
  const years = groupsForDecade(activeDecade);

  return (
    <div>
      {/* Desktop / tablet: two-step tab UI */}
      <div className="hidden sm:block">
        <div role="tablist" aria-label={lang === "ko" ? "학번 시대 선택" : "Select cohort decade"} className="flex flex-wrap gap-2">
          {DECADES.map((d) => (
            <button
              key={d.slug}
              role="tab"
              aria-selected={activeDecade === d.slug}
              onClick={() => setActiveDecade(d.slug)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                activeDecade === d.slug
                  ? "border-primary bg-primary text-white"
                  : "border-line text-ink/70 hover:border-primary hover:text-primary"
              }`}
            >
              {lang === "ko" ? d.labelKr : d.labelEn}
              <span className="ml-1.5 opacity-70">({lang === "ko" ? d.rangeKr : d.rangeEn})</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 rounded-lg border border-dashed border-line p-4">
          {years.map((y) => (
            <Link
              key={y.slug}
              href={academicsPath(lang, activeDecade, y.slug)}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-ink/80 transition-colors hover:border-primary hover:text-primary"
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
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-ink"
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
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-ink"
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
