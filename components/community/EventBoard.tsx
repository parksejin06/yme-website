"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Paperclip } from "lucide-react";
import TabRow from "@/components/ui/TabRow";
import SelectField from "@/components/ui/SelectField";
import SearchField from "@/components/ui/SearchField";
import ResultsSummary from "@/components/ui/ResultsSummary";
import { postHref, eventOccurrence, type CommunityPost, type EventOccurrence } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    upcoming: "예정",
    past: "종료",
    allYear: "전체 연도",
    allMonth: "전체 월",
    year: (y: number) => `${y}년`,
    month: (m: number) => `${m}월`,
    search: "행사명으로 검색",
    noResults: "등록된 행사가 없습니다.",
    count: (n: number) => `전체 ${n}건`,
    sessions: (n: number) => `외 ${n - 1}회`,
  },
  en: {
    all: "All",
    upcoming: "Upcoming",
    past: "Past",
    allYear: "All years",
    allMonth: "All months",
    year: (y: number) => String(y),
    month: (m: number) => `${m}`,
    search: "Search by event title",
    noResults: "No events posted.",
    count: (n: number) => `${n} events`,
    sessions: (n: number) => `+${n - 1} more`,
  },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateLabel(occ: EventOccurrence) {
  const start = `${pad(occ.startMonth)}.${pad(occ.startDay)}`;
  if (occ.startMonth === occ.endMonth && occ.startDay === occ.endDay) return start;
  return `${start} – ${pad(occ.endMonth)}.${pad(occ.endDay)}`;
}

type Status = "upcoming" | "past";

function statusOf(post: CommunityPost, occ: EventOccurrence | null, now: Date): Status {
  let endDate: Date;
  if (occ) {
    endDate = new Date(occ.endYear, occ.endMonth - 1, occ.endDay, 23, 59, 59);
  } else if (post.publishedAt) {
    const [y, m, d] = post.publishedAt.split(".").map(Number);
    endDate = new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59);
  } else {
    endDate = now;
  }
  return endDate >= now ? "upcoming" : "past";
}

export default function EventBoard({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
  const t = COPY[lang];
  const now = useMemo(() => new Date(), []);

  const enriched = useMemo(
    () =>
      items.map((post) => {
        const occ = eventOccurrence(post);
        const fallbackYear = post.publishedAt ? Number(post.publishedAt.slice(0, 4)) : now.getFullYear();
        const fallbackMonth = post.publishedAt ? Number(post.publishedAt.slice(5, 7)) : now.getMonth() + 1;
        return {
          post,
          occ,
          year: occ?.startYear ?? fallbackYear,
          month: occ?.startMonth ?? fallbackMonth,
          day: occ?.startDay ?? (post.publishedAt ? Number(post.publishedAt.slice(8, 10)) : 1),
          status: statusOf(post, occ, now),
        };
      }),
    [items, now]
  );

  const years = useMemo(() => Array.from(new Set(enriched.map((e) => e.year))).sort((a, b) => b - a), [enriched]);

  const [status, setStatus] = useState<"all" | Status>("all");
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched
      .filter((e) => status === "all" || e.status === status)
      .filter((e) => year === "all" || String(e.year) === year)
      .filter((e) => month === "all" || String(e.month) === month)
      .filter((e) => !q || e.post.title.toLowerCase().includes(q) || e.post.plainText.toLowerCase().includes(q))
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "upcoming" ? -1 : 1;
        const ak = a.year * 10000 + a.month * 100 + a.day;
        const bk = b.year * 10000 + b.month * 100 + b.day;
        return a.status === "upcoming" ? ak - bk : bk - ak;
      });
  }, [enriched, status, year, month, query]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TabRow
            ariaLabel={lang === "ko" ? "행사 상태" : "Event status"}
            size="sm"
            value={status}
            onChange={(v) => setStatus(v as "all" | Status)}
            items={[
              { value: "all", label: t.all },
              { value: "upcoming", label: t.upcoming },
              { value: "past", label: t.past },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <SelectField
              ariaLabel={lang === "ko" ? "연도 선택" : "Select year"}
              value={year}
              onChange={setYear}
              options={[{ value: "all", label: t.allYear }, ...years.map((y) => ({ value: String(y), label: t.year(y) }))]}
            />
            <SelectField
              ariaLabel={lang === "ko" ? "월 선택" : "Select month"}
              value={month}
              onChange={setMonth}
              options={[
                { value: "all", label: t.allMonth },
                ...Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({ value: String(m), label: t.month(m) })),
              ]}
            />
          </div>
        </div>
        <SearchField value={query} onChange={setQuery} placeholder={t.search} className="max-w-md" />
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-line pb-3">
        <ResultsSummary>{t.count(filtered.length)}</ResultsSummary>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="divide-y divide-line">
          {filtered.map(({ post, occ, status: rowStatus }) => {
            const displayTitle = occ ? post.title.replace(/^\s*\[[^\]]+\]\s*/, "") : post.title;
            return (
              <li key={post.id}>
                <Link
                  href={postHref(lang, "events", post.sourcePostId)}
                  className="group flex min-h-[120px] items-center gap-6 py-6 transition-colors hover:bg-surface-muted/50 sm:gap-8 sm:py-7"
                >
                  <div className="w-16 shrink-0 text-center sm:w-28">
                    {occ ? (
                      <>
                        <p className="text-xs text-ink/45">{occ.startYear}</p>
                        <p className="mt-1 font-display text-base font-bold text-ink sm:text-lg">{dateLabel(occ)}</p>
                        {occ.isMultiSession && <p className="mt-0.5 text-[11px] text-ink/40">{t.sessions(occ.sessionCount)}</p>}
                      </>
                    ) : (
                      <p className="text-xs text-ink/40" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {post.publishedAt}
                      </p>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 border-l border-line pl-6 sm:pl-8">
                    <p className="flex items-center gap-2 text-balance font-display text-base text-ink group-hover:text-primary sm:text-lg">
                      <span className="line-clamp-1">{displayTitle}</span>
                      {post.attachments.length > 0 && <Paperclip className="h-3.5 w-3.5 shrink-0 text-ink/35" />}
                    </p>
                    {post.excerpt && <p className="mt-1.5 line-clamp-1 text-sm text-ink/55">{post.excerpt}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`hidden text-xs font-medium sm:inline ${rowStatus === "upcoming" ? "text-primary" : "text-ink/35"}`}>
                      {rowStatus === "upcoming" ? t.upcoming : t.past}
                    </span>
                    <ArrowRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
