"use client";

import { useMemo, useState } from "react";
import { Search, FileDown } from "lucide-react";
import type { Resource } from "@/lib/community";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    searchPlaceholder: "자료명으로 검색",
    all: "전체",
    sortNewest: "최신순",
    sortName: "이름순",
    noResults: "등록된 자료가 없습니다.",
  },
  en: {
    searchPlaceholder: "Search by title",
    all: "All",
    sortNewest: "Newest",
    sortName: "By name",
    noResults: "No files available.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function ResourceLibrary({ items, lang }: { items: Resource[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<"newest" | "name">("newest");
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);

  const filtered = items
    .filter((i) => categoryFilter === "all" || i.category === categoryFilter)
    .filter((i) => !query.trim() || i.title.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (sort === "newest" ? b.registeredDate.localeCompare(a.registeredDate) : a.title.localeCompare(b.title)));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[220px] max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="min-h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="inline-flex rounded-md border border-line p-0.5">
          <button
            onClick={() => setSort("newest")}
            className={`min-h-9 rounded px-3 text-xs font-medium ${sort === "newest" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            {t.sortNewest}
          </button>
          <button
            onClick={() => setSort("name")}
            className={`min-h-9 rounded px-3 text-xs font-medium ${sort === "name" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            {t.sortName}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button onClick={() => setCategoryFilter("all")} className={chipClass(categoryFilter === "all")}>
          {t.all}
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={chipClass(categoryFilter === c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {filtered.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate font-display text-sm text-ink">{r.title}</p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {r.category} · {r.fileType} · {r.fileSize} · {r.registeredDate}
                </p>
              </div>
              <a
                href={r.filePath}
                download
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-primary hover:text-primary"
              >
                <FileDown className="h-3.5 w-3.5" /> {lang === "ko" ? "다운로드" : "Download"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
