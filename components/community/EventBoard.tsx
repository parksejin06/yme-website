"use client";

import { useMemo, useState } from "react";
import type { CommunityEvent } from "@/lib/community";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    upcoming: "예정",
    ongoing: "진행 중",
    ended: "종료",
    location: "장소",
    target: "대상",
    noResults: "예정된 행사가 없습니다.",
  },
  en: {
    all: "All",
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    ended: "Ended",
    location: "Location",
    target: "Target",
    noResults: "No events scheduled.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

function statusOf(e: CommunityEvent): "upcoming" | "ongoing" | "ended" {
  const now = Date.now();
  const start = new Date(e.startDate).getTime();
  const end = new Date(e.endDate ?? e.startDate).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "ongoing";
}

export default function EventBoard({ items, lang }: { items: CommunityEvent[]; lang: Lang }) {
  const t = COPY[lang];
  const [typeFilter, setTypeFilter] = useState("all");
  const types = useMemo(() => [...new Set(items.map((i) => i.type))], [items]);

  const filtered = items.filter((i) => typeFilter === "all" || i.type === typeFilter);
  const statusLabel = { upcoming: t.upcoming, ongoing: t.ongoing, ended: t.ended };
  const statusClass = {
    upcoming: "bg-primary/10 text-primary",
    ongoing: "bg-emerald-100 text-emerald-700",
    ended: "bg-surface-muted text-ink/40",
  };

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
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((e) => {
            const status = statusOf(e);
            return (
              <div key={e.id} className="rounded-lg border border-line p-5">
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${statusClass[status]}`}>
                  {statusLabel[status]}
                </span>
                <p className="mt-2 font-display text-base text-ink">{e.title}</p>
                <p className="mt-1 text-xs text-ink/50">{e.type}</p>
                <dl className="mt-3 space-y-1 text-xs text-ink/60">
                  <div className="flex gap-2">
                    <dt className="w-12 shrink-0">{lang === "ko" ? "일시" : "Date"}</dt>
                    <dd>
                      {e.startDate}
                      {e.endDate && e.endDate !== e.startDate ? ` ~ ${e.endDate}` : ""}
                    </dd>
                  </div>
                  {e.location && (
                    <div className="flex gap-2">
                      <dt className="w-12 shrink-0">{t.location}</dt>
                      <dd>{e.location}</dd>
                    </div>
                  )}
                  {e.target && (
                    <div className="flex gap-2">
                      <dt className="w-12 shrink-0">{t.target}</dt>
                      <dd>{e.target}</dd>
                    </div>
                  )}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
