"use client";

import { useState } from "react";
import SearchField from "@/components/ui/SearchField";
import type { Lang } from "@/lib/nav";

export default function CommunitySearchBar({ lang, initialQuery = "" }: { lang: Lang; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const action = lang === "ko" ? "/news/search" : "/en/news/search";
  const placeholder = lang === "ko" ? "뉴스 및 공지사항 전체에서 검색" : "Search all news & community content";

  return (
    <form action={action} method="get">
      <SearchField value={query} onChange={setQuery} placeholder={placeholder} name="q" />
    </form>
  );
}
