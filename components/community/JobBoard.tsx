"use client";

import { useMemo, useState } from "react";
import type { JobPosting } from "@/lib/community";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    closingSoon: "마감 임박",
    closed: "마감",
    open: "접수중",
    deadline: "마감일",
    posted: "게시일",
    noResults: "등록된 채용정보가 없습니다.",
    goToPosting: "채용 페이지로 이동",
  },
  en: {
    all: "All",
    closingSoon: "Closing Soon",
    closed: "Closed",
    open: "Open",
    deadline: "Deadline",
    posted: "Posted",
    noResults: "No job postings available.",
    goToPosting: "Go to job posting",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

function isClosingSoon(deadline: string) {
  const days = (new Date(deadline).getTime() - Date.now()) / 86400000;
  return days >= 0 && days <= 7;
}
function isClosed(deadline: string) {
  return new Date(deadline).getTime() < Date.now();
}

export default function JobBoard({ items, lang }: { items: JobPosting[]; lang: Lang }) {
  const t = COPY[lang];
  const [typeFilter, setTypeFilter] = useState("all");
  const types = useMemo(() => [...new Set(items.map((i) => i.type))], [items]);

  const filtered = items
    .filter((i) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "closingSoon") return isClosingSoon(i.applyEnd);
      return i.type === typeFilter;
    })
    .sort((a, b) => a.applyEnd.localeCompare(b.applyEnd));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setTypeFilter("all")} className={chipClass(typeFilter === "all")}>
          {t.all}
        </button>
        {types.map((type) => (
          <button key={type} onClick={() => setTypeFilter(type)} className={chipClass(typeFilter === type)}>
            {type}
          </button>
        ))}
        <button onClick={() => setTypeFilter("closingSoon")} className={chipClass(typeFilter === "closingSoon")}>
          {t.closingSoon}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {filtered.map((j) => {
            const closed = isClosed(j.applyEnd);
            return (
              <li key={j.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      closed ? "bg-surface-muted text-ink/40" : isClosingSoon(j.applyEnd) ? "bg-accent text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {closed ? t.closed : t.open}
                  </span>
                  <p className="font-display text-sm text-ink">
                    {j.company} · {j.title}
                  </p>
                </div>
                <p className="mt-1.5 text-xs text-ink/50">
                  {j.type}
                  {j.target ? ` · ${j.target}` : ""} · {t.deadline} {j.applyEnd}
                </p>
                {j.link && (
                  <a
                    href={j.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    {t.goToPosting} →
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
