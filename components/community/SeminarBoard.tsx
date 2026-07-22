"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref, extractLeadingBracketTag } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { all: "전체", noResults: "등록된 세미나가 없습니다." },
  en: { all: "All", noResults: "No seminars posted." },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function SeminarBoard({ items, lang }: { items: CommunityPost[]; lang: Lang }) {
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
        <ul className="mt-8 grid divide-y divide-line border-y border-line lg:grid-cols-2 lg:gap-x-10 lg:divide-y-0">
          {filtered.map((s) => (
            <li key={s.id} className="py-5 lg:border-b lg:border-line">
              <Link href={postHref(lang, "seminars", s.sourcePostId)} className="flex items-start gap-2.5 hover:text-primary">
                <span className="line-clamp-2 text-balance font-display text-[17px] text-ink">{s.title}</span>
                {s.attachments.length > 0 && <Paperclip className="mt-1 h-4 w-4 shrink-0 text-ink/35" />}
              </Link>
              <p className="mt-2 text-sm text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                {s.author} · {s.publishedAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
