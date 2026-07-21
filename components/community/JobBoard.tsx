"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Paperclip, Search } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { search: "제목으로 검색", noResults: "등록된 채용정보가 없습니다." },
  en: { search: "Search by title", noResults: "No job postings available." },
};

export default function JobBoard({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="min-h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {filtered.map((j) => (
            <li key={j.id} className="py-4">
              <Link href={postHref(lang, "jobs", j.sourcePostId)} className="flex items-center gap-2 hover:text-primary">
                <span className="line-clamp-1 font-display text-sm text-ink">{j.title}</span>
                {j.attachments.length > 0 && <Paperclip className="h-3.5 w-3.5 shrink-0 text-ink/35" />}
              </Link>
              <p className="mt-1 text-xs text-ink/50" style={{ fontVariantNumeric: "tabular-nums" }}>
                {j.author} · {j.publishedAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
