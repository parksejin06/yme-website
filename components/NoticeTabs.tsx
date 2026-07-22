"use client";

import { useMemo, useState } from "react";
import NoticeTable from "./NoticeTable";
import TabRow from "@/components/ui/TabRow";
import SearchField from "@/components/ui/SearchField";
import { NOTICE_BOARDS, boardLabel, type CommunityPost } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

type NoticeBoardKey = (typeof NOTICE_BOARDS)[number];

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <TabRow
          ariaLabel={lang === "ko" ? "공지사항 게시판 선택" : "Select notice board"}
          value={active}
          onChange={(v) => setActive(v as NoticeBoardKey)}
          items={NOTICE_BOARDS.map((b) => ({ value: b, label: boardLabel(b, lang), count: boards[b]?.length ?? 0 }))}
        />
        <SearchField value={query} onChange={setQuery} placeholder={searchPlaceholder} className="w-full sm:w-80" />
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
