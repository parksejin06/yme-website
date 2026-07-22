import Link from "next/link";
import { Paperclip } from "lucide-react";
import type { CommunityPost, BoardKey } from "@/lib/community-content";
import { boardLabel, postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

export default function SearchResults({
  results,
  query,
  lang,
}: {
  results: { board: BoardKey; post: CommunityPost }[];
  query: string;
  lang: Lang;
}) {
  const t =
    lang === "ko"
      ? { count: (n: number) => `"${query}" 검색 결과 ${n}건`, empty: `"${query}"에 대한 검색 결과가 없습니다.`, prompt: "검색어를 입력해 주세요." }
      : { count: (n: number) => `${n} result(s) for "${query}"`, empty: `No results for "${query}".`, prompt: "Enter a search term." };

  if (!query.trim()) {
    return <p className="py-16 text-center text-sm text-ink/40">{t.prompt}</p>;
  }

  if (results.length === 0) {
    return <p className="py-16 text-center text-sm text-ink/40">{t.empty}</p>;
  }

  return (
    <div>
      <p className="text-base text-ink/50">{t.count(results.length)}</p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {results.map(({ board, post }) => (
          <li key={post.id}>
            <Link href={postHref(lang, board, post.sourcePostId)} className="block px-2 py-5 hover:bg-surface-muted/60">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">
                  {boardLabel(board, lang)}
                </span>
                <span className="line-clamp-1 text-[17px] font-medium text-ink">{post.title}</span>
                {post.attachments.length > 0 && <Paperclip className="h-4 w-4 shrink-0 text-ink/35" />}
              </div>
              <p className="mt-2 line-clamp-1 text-sm text-ink/50">{post.excerpt}</p>
              <div className="mt-1.5 flex gap-3 text-sm text-ink/40">
                {post.author && <span>{post.author}</span>}
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.publishedAt}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
