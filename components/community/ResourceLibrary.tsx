"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileDown, FileText } from "lucide-react";
import SearchField from "@/components/ui/SearchField";
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
      <SearchField value={query} onChange={setQuery} placeholder={t.search} className="max-w-md" />

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const firstFile = r.attachments[0];
            return (
              <li key={r.id} className="flex items-start gap-4 border border-line p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary/50">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={postHref(lang, "resources", r.sourcePostId)} className="line-clamp-2 font-display text-base text-ink hover:text-primary">
                    {r.title}
                  </Link>
                  <p className="mt-1.5 text-sm text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {r.publishedAt}
                    {r.attachments.length > 0 && ` · ${r.attachments.length}${t.files}`}
                  </p>
                  {firstFile && (
                    <a
                      href={firstFile.localPath || firstFile.fileUrl}
                      download={!!firstFile.localPath}
                      className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3.5 text-sm font-medium text-ink/70 hover:border-primary hover:text-primary"
                    >
                      <FileDown className="h-4 w-4" /> {lang === "ko" ? "다운로드" : "Download"}
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
