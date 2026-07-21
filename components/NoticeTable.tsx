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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-y border-line text-left text-ink/70">
            <th scope="col" className="w-20 px-3 py-3 font-display font-normal">
              {label.no}
            </th>
            <th scope="col" className="px-3 py-3 font-display font-normal">
              {label.title}
            </th>
            <th scope="col" className="w-32 px-3 py-3 font-display font-normal">
              {label.author}
            </th>
            <th scope="col" className="w-28 px-3 py-3 font-display font-normal">
              {label.date}
            </th>
          </tr>
        </thead>
        <tbody>
          {pinned.map((n) => (
            <tr key={n.id} className="border-b border-line bg-surface-muted/50 hover:bg-surface-muted">
              <td className="px-3 py-4 text-ink/40">
                <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">{label.notice}</span>
              </td>
              <td className="px-3 py-4">
                <Link href={postHref(lang, board, n.sourcePostId)} className="flex items-center gap-2 hover:text-primary">
                  <span className="line-clamp-1 text-ink/85">{n.title}</span>
                  {n.attachments.length > 0 && (
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-ink/35" aria-label={label.attachment} />
                  )}
                </Link>
              </td>
              <td className="px-3 py-4 text-ink/70">{n.author}</td>
              <td className="px-3 py-4 text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                {n.publishedAt}
              </td>
            </tr>
          ))}
          {numbered.map(({ n, no }) => (
            <tr key={n.id} className="border-b border-line hover:bg-surface-muted">
              <td className="px-3 py-4 text-ink/70">{no}</td>
              <td className="px-3 py-4">
                <Link href={postHref(lang, board, n.sourcePostId)} className="flex items-center gap-2 hover:text-primary">
                  {n.isNew && (
                    <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">NEW</span>
                  )}
                  <span className="line-clamp-1 text-ink/85">{n.title}</span>
                  {n.attachments.length > 0 && (
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-ink/35" aria-label={label.attachment} />
                  )}
                </Link>
              </td>
              <td className="px-3 py-4 text-ink/70">{n.author}</td>
              <td className="px-3 py-4 text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                {n.publishedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
