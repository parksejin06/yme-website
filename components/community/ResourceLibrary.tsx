"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileDown, FileText } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { search: "자료명으로 검색", noResults: "등록된 자료가 없습니다.", files: "개 파일" },
  en: { search: "Search by title", noResults: "No files available.", files: " file(s)" },
};

export default function ResourceLibrary({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
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
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {filtered.map((r) => {
            const firstFile = r.attachments[0];
            return (
              <li key={r.id} className="flex items-start gap-3 rounded-lg border border-line p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary/50">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={postHref(lang, "resources", r.sourcePostId)} className="line-clamp-2 font-display text-sm text-ink hover:text-primary">
                    {r.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {r.publishedAt}
                    {r.attachments.length > 0 && ` · ${r.attachments.length}${t.files}`}
                  </p>
                  {firstFile && (
                    <a
                      href={firstFile.localPath || firstFile.fileUrl}
                      download={!!firstFile.localPath}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-primary hover:text-primary"
                    >
                      <FileDown className="h-3.5 w-3.5" /> {lang === "ko" ? "다운로드" : "Download"}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
