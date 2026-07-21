"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Lang } from "@/lib/nav";

export default function CommunitySearchBar({ lang, initialQuery = "" }: { lang: Lang; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const action = lang === "ko" ? "/news/search" : "/en/news/search";
  const placeholder = lang === "ko" ? "뉴스 및 공지사항 전체에서 검색" : "Search all news & community content";

  return (
    <form action={action} method="get" className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
      <input
        type="text"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none focus:border-primary"
      />
    </form>
  );
}
