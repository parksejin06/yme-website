"use client";

import { useState } from "react";
import { SEMINAR_FIELDS, type Seminar } from "@/lib/community";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    speaker: "연사",
    noResults: "예정된 세미나가 없습니다.",
  },
  en: {
    all: "All",
    speaker: "Speaker",
    noResults: "No seminars scheduled.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function SeminarBoard({ items, lang }: { items: Seminar[]; lang: Lang }) {
  const t = COPY[lang];
  const [fieldFilter, setFieldFilter] = useState("all");

  const filtered = items
    .filter((i) => fieldFilter === "all" || i.field === fieldFilter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setFieldFilter("all")} className={chipClass(fieldFilter === "all")}>
          {t.all}
        </button>
        {SEMINAR_FIELDS.map((f) => (
          <button key={f} onClick={() => setFieldFilter(f)} className={chipClass(fieldFilter === f)}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {filtered.map((s) => (
            <li key={s.id} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-sm text-ink">{s.title}</p>
                <p className="text-xs text-ink/45">
                  {s.date}
                  {s.startTime ? ` ${s.startTime}` : ""}
                </p>
              </div>
              <p className="mt-1 text-xs text-ink/60">
                {t.speaker}: {s.speaker}
                {s.affiliation ? ` (${s.affiliation})` : ""}
                {s.location ? ` · ${s.location}` : ""}
              </p>
              {s.abstract && <p className="mt-2 text-sm text-ink/70">{s.abstract}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
