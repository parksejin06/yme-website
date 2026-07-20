"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Lang } from "@/lib/nav";

interface Notice {
  id: number;
  isNotice: boolean;
  title: string;
  author: string;
  date: string;
  content: string;
  hasAttachment: boolean;
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 text-ink/35">
      <path
        d="M14.5 7.5 8.4 13.6a2.5 2.5 0 1 1-3.54-3.54l6.1-6.1a1.5 1.5 0 0 1 2.12 2.12L7 12.15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NoticeTable({ lang, notices }: { lang: Lang; notices: Notice[] }) {
  const [selected, setSelected] = useState<Notice | null>(null);

  const label = {
    ko: { no: "번호", title: "제목", author: "작성자", date: "날짜", attachment: "첨부파일 있음", notice: "공지" },
    en: { no: "No.", title: "Title", author: "Author", date: "Date", attachment: "Has attachment", notice: "Notice" },
  }[lang];

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
          {notices.map((n) => (
            <tr
              key={n.id}
              onClick={() => setSelected(n)}
              className="cursor-pointer border-b border-line hover:bg-surface-muted"
            >
              <td className="px-3 py-4 text-ink/70">{n.id}</td>
              <td className="px-3 py-4">
                <span className="flex items-center gap-2">
                  {n.isNotice && (
                    <span
                      className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white"
                      aria-label={label.notice}
                    >
                      {label.notice}
                    </span>
                  )}
                  <span className="text-ink/85">{n.title}</span>
                  {n.hasAttachment && (
                    <span aria-label={label.attachment}>
                      <PaperclipIcon />
                    </span>
                  )}
                </span>
              </td>
              <td className="px-3 py-4 text-ink/70">{n.author}</td>
              <td className="px-3 py-4 text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                {n.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="notice-detail-title" panelClassName="max-w-xl">
        {selected && (
          <div className="p-6">
            <div className="flex items-center gap-2 pr-8">
              {selected.isNotice && (
                <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {label.notice}
                </span>
              )}
              <h3 id="notice-detail-title" className="font-display text-lg text-ink">
                {selected.title}
              </h3>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-ink/50">
              <span>{selected.author}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{selected.date}</span>
              {selected.hasAttachment && (
                <span className="flex items-center gap-1">
                  <PaperclipIcon />
                  {label.attachment}
                </span>
              )}
            </div>
            <p className="mt-4 whitespace-pre-line border-t border-line pt-4 text-sm leading-relaxed text-ink/80">
              {selected.content}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
