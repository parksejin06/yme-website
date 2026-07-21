"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref, extractLeadingBracketTag } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { all: "전체", noResults: "등록된 행사가 없습니다." },
  en: { all: "All", noResults: "No events posted." },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function EventBoard({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
  const t = COPY[lang];
  const [typeFilter, setTypeFilter] = useState("all");
  const types = useMemo(() => {
    const s = new Set<string>();
    for (const i of items) {
      const tag = extractLeadingBracketTag(i.title);
      if (tag) s.add(tag);
    }
    return Array.from(s);
  }, [items]);

  const filtered = items.filter((i) => typeFilter === "all" || extractLeadingBracketTag(i.title) === typeFilter);

  return (
    <div>
      {types.length > 0 && (
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
      )}

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((e) => (
            <Link key={e.id} href={postHref(lang, "events", e.sourcePostId)} className="rounded-lg border border-line p-5 hover:border-primary-soft">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-base text-ink">{e.title}</p>
                {e.attachments.length > 0 && <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-ink/35" />}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink/60">{e.excerpt}</p>
              <p className="mt-3 text-xs text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                {e.author} · {e.publishedAt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
