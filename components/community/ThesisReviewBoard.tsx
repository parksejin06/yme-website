"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Paperclip, Search } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { search: "제목으로 검색", no: "번호", title: "제목", author: "작성자", date: "등록일", noResults: "게시된 공고가 없습니다." },
  en: { search: "Search by title", no: "No.", title: "Title", author: "Author", date: "Posted", noResults: "No notices posted." },
};

export default function ThesisReviewBoard({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q) || (i.author ?? "").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="min-h-12 w-full rounded-md border border-line bg-white pl-10 pr-3 text-base text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-8 overflow-x-auto overflow-y-hidden border border-line">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-muted text-left text-sm">
                <th className="w-16 px-4 py-4 font-display font-normal text-ink/70">{t.no}</th>
                <th className="px-4 py-4 font-display font-normal text-ink/70">{t.title}</th>
                <th className="w-40 px-4 py-4 font-display font-normal text-ink/70">{t.author}</th>
                <th className="w-32 px-4 py-4 font-display font-normal text-ink/70">{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i, idx) => (
                <tr key={i.id} className="border-t border-line hover:bg-surface-muted/60">
                  <td className="px-4 py-5 text-sm text-ink/50">{filtered.length - idx}</td>
                  <td className="px-4 py-5">
                    <Link href={postHref(lang, "thesis-reviews", i.sourcePostId)} className="flex items-center gap-2.5 hover:text-primary">
                      <span className="line-clamp-1 text-[17px] text-ink sm:text-lg">{i.title}</span>
                      {i.attachments.length > 0 && <Paperclip className="h-4 w-4 shrink-0 text-ink/35" />}
                    </Link>
                  </td>
                  <td className="px-4 py-5 text-sm text-ink/70">{i.author}</td>
                  <td className="px-4 py-5 text-sm text-ink/50" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {i.publishedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
