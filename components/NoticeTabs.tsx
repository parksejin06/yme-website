"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import NoticeTable from "./NoticeTable";
import { NOTICE_BOARDS, boardLabel, type CommunityPost } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

type NoticeBoardKey = (typeof NOTICE_BOARDS)[number];

function chipClass(active: boolean) {
  return `inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function NoticeTabs({
  lang,
  boards,
}: {
  lang: Lang;
  boards: Record<NoticeBoardKey, CommunityPost[]>;
}) {
  const [active, setActive] = useState<NoticeBoardKey>(NOTICE_BOARDS[0]);
  const [query, setQuery] = useState("");

  const noResults = lang === "ko" ? "검색 결과가 없습니다." : "No results found.";
  const searchPlaceholder = lang === "ko" ? "제목, 작성자로 검색" : "Search by title or author";

  const filtered = useMemo(() => {
    const list = boards[active] ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (n) => n.title.toLowerCase().includes(q) || (n.author ?? "").toLowerCase().includes(q) || n.plainText.toLowerCase().includes(q)
    );
  }, [boards, active, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {NOTICE_BOARDS.map((b) => (
            <button key={b} onClick={() => setActive(b)} className={chipClass(active === b)}>
              {boardLabel(b, lang)}
              <span className="ml-1.5 text-xs opacity-60">{boards[b]?.length ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="min-h-10 w-full rounded-full border border-line bg-white pl-9 pr-9 text-sm outline-none focus:border-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="clear"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink/40">{noResults}</p>
        ) : (
          <NoticeTable lang={lang} board={active} notices={filtered} />
        )}
      </div>
    </div>
  );
}
