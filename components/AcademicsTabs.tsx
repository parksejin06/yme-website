"use client";

import { useState } from "react";
import type { Lang } from "@/lib/nav";
import DecadeYearPicker from "@/components/academics/DecadeYearPicker";

const COPY = {
  ko: {
    tabs: ["학부", "대학원"],
    headers: ["이수구분", "교과목명", "학점", "비고"],
    placeholder: "[과목 리스트 추후 제공]",
    pickerIntro: "학번 시대를 먼저 선택한 뒤, 세부 학번을 선택하면 졸업요건과 교육과정을 확인할 수 있습니다.",
  },
  en: {
    tabs: ["Undergraduate", "Graduate"],
    headers: ["Category", "Course Title", "Credits", "Notes"],
    placeholder: "[Course list to be provided]",
    pickerIntro: "Select your cohort decade, then your specific cohort, to view graduation requirements and curriculum.",
  },
};

export default function AcademicsTabs({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label={lang === "ko" ? "학부/대학원 전환" : "Undergraduate / Graduate"} className="flex gap-2">
        {t.tabs.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`rounded-full border px-5 py-2 text-sm transition-colors ${
              tab === i ? "border-primary bg-primary text-white" : "border-line text-ink/70 hover:border-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 ? (
        <div className="mt-8">
          <p className="mb-6 text-sm text-ink/60">{t.pickerIntro}</p>
          <DecadeYearPicker lang={lang} />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-muted text-left">
                {t.headers.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-display font-normal text-ink/70">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td colSpan={t.headers.length} className="px-4 py-10 text-center text-ink/70">
                  {t.placeholder}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
