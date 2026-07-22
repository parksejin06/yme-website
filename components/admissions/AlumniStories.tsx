"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Lang } from "@/lib/nav";

export interface AlumniStory {
  id: string;
  nameKr: string;
  nameEn: string;
  gradYear: number;
  roleKr: string;
  roleEn: string;
  summaryKr: string;
  summaryEn: string;
  fullStoryKr: string;
  fullStoryEn: string;
}

const COPY = {
  ko: { gradYear: (y: number) => `${y}년 졸업`, more: "자세히 보기" },
  en: { gradYear: (y: number) => `Class of ${y}`, more: "Read more" },
};

/** `stories` is placeholder/example content (data/alumni-stories.json): names are "OOO"
 * placeholders, not real alumni, meant to be swapped for real interviews by dept staff. */
export default function AlumniStories({ stories, lang }: { stories: AlumniStory[]; lang: Lang }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = COPY[lang];
  const selected = stories.find((s) => s.id === openId) ?? null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpenId(s.id)}
            className="group flex flex-col items-start border border-line bg-white p-5 text-left transition-colors hover:border-primary/50"
          >
            <p className="text-xs text-ink/45">{t.gradYear(s.gradYear)}</p>
            <p className="mt-2 font-display text-lg text-ink">{lang === "ko" ? s.nameKr : s.nameEn}</p>
            <p className="mt-0.5 text-sm text-primary">{lang === "ko" ? s.roleKr : s.roleEn}</p>
            <p className="mt-3 line-clamp-4 text-sm text-ink/70">{lang === "ko" ? s.summaryKr : s.summaryEn}</p>
            <span className="mt-4 text-xs font-medium text-ink/50 group-hover:text-primary">{t.more} →</span>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setOpenId(null)} labelledBy="alumni-story-title" panelClassName="max-w-xl">
        {selected && (
          <div className="p-8">
            <p className="text-xs text-ink/45">{t.gradYear(selected.gradYear)}</p>
            <h3 id="alumni-story-title" className="mt-2 font-display text-xl text-ink">
              {lang === "ko" ? selected.nameKr : selected.nameEn}
            </h3>
            <p className="mt-0.5 text-sm text-primary">{lang === "ko" ? selected.roleKr : selected.roleEn}</p>
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink/75">
              {lang === "ko" ? selected.fullStoryKr : selected.fullStoryEn}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
