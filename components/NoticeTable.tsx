import Link from "next/link";
import { Paperclip } from "lucide-react";
import type { CommunityPost, BoardKey } from "@/lib/community-content";
import { postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

export default function NoticeTable({ lang, board, notices }: { lang: Lang; board: BoardKey; notices: CommunityPost[] }) {
  const label = {
    ko: { no: "번호", title: "제목", author: "작성자", date: "날짜", attachment: "첨부파일 있음", notice: "공지" },
    en: { no: "No.", title: "Title", author: "Author", date: "Date", attachment: "Has attachment", notice: "Notice" },
  }[lang];

  const pinned = notices.filter((n) => n.isPinned);
  const rest = notices.filter((n) => !n.isPinned);
  const numbered = rest.map((n, i) => ({ n, no: rest.length - i }));

  return (
    <>
      {/* Desktop/tablet: full data table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-y border-line text-left text-sm text-ink/70">
              <th scope="col" className="w-20 px-4 py-4 font-display font-normal">
                {label.no}
              </th>
              <th scope="col" className="px-4 py-4 font-display font-normal">
                {label.title}
              </th>
              <th scope="col" className="w-40 px-4 py-4 font-display font-normal">
                {label.author}
              </th>
              <th scope="col" className="w-32 px-4 py-4 font-display font-normal">
                {label.date}
              </th>
            </tr>
          </thead>
          <tbody>
            {pinned.map((n) => (
              <tr key={n.id} className="border-b border-line bg-surface-muted/50 hover:bg-surface-muted">
                <td className="px-4 py-6 text-sm text-ink/40">
                  <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-white">{label.notice}</span>
                </td>
                <td className="px-4 py-6">
                  <Link href={postHref(lang, board, n.sourcePostId)} className="flex items-center gap-2.5 hover:text-primary">
                    <span className="line-clamp-1 text-[17px] text-ink/85 sm:text-lg">{n.title}</span>
                    {n.attachments.length > 0 && (
                      <Paperclip className="h-4 w-4 shrink-0 text-ink/35" aria-label={label.attachment} />
                    )}
                  </Link>
                </td>
                <td className="px-4 py-6 text-sm text-ink/70">{n.author}</td>
                <td className="px-4 py-6 text-sm text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {n.publishedAt}
                </td>
              </tr>
            ))}
            {numbered.map(({ n, no }) => (
              <tr key={n.id} className="border-b border-line hover:bg-surface-muted">
                <td className="px-4 py-6 text-sm text-ink/70">{no}</td>
                <td className="px-4 py-6">
                  <Link href={postHref(lang, board, n.sourcePostId)} className="flex items-center gap-2.5 hover:text-primary">
                    {n.isNew && (
                      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">NEW</span>
                    )}
                    <span className="line-clamp-1 text-[17px] text-ink/85 sm:text-lg">{n.title}</span>
                    {n.attachments.length > 0 && (
                      <Paperclip className="h-4 w-4 shrink-0 text-ink/35" aria-label={label.attachment} />
                    )}
                  </Link>
                </td>
                <td className="px-4 py-6 text-sm text-ink/70">{n.author}</td>
                <td className="px-4 py-6 text-sm text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {n.publishedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked list -- category/title/date/attachment, no horizontal scroll */}
      <ul className="divide-y divide-line border-y border-line sm:hidden">
        {[...pinned.map((n) => ({ n, pinnedRow: true })), ...numbered.map(({ n }) => ({ n, pinnedRow: false }))].map(
          ({ n, pinnedRow }) => (
            <li key={n.id} className={pinnedRow ? "bg-surface-muted/50" : undefined}>
              <Link href={postHref(lang, board, n.sourcePostId)} className="block px-1 py-4">
                <div className="flex items-center gap-2">
                  {pinnedRow && (
                    <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {label.notice}
                    </span>
                  )}
                  {!pinnedRow && n.isNew && (
                    <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">NEW</span>
                  )}
                  <span className="line-clamp-2 flex-1 text-[15px] text-ink/85">{n.title}</span>
                  {n.attachments.length > 0 && (
                    <Paperclip className="h-4 w-4 shrink-0 text-ink/35" aria-label={label.attachment} />
                  )}
                </div>
                <div className="mt-1.5 flex gap-3 text-xs text-ink/50">
                  <span>{n.author}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{n.publishedAt}</span>
                </div>
              </Link>
            </li>
          )
        )}
      </ul>
    </>
  );
}
