"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe, ImageOff, MapPin, PlayCircle } from "lucide-react";
import { MailIcon, PhoneIcon } from "@/components/icons";
import { positionLabel } from "@/lib/faculty";
import type { LabEntry } from "@/lib/labs";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    advisor: "지도교수",
    noEmail: "메일 미등록",
    noPhone: "번호 미등록",
    visitSite: "홈페이지 방문",
    research: "대표 연구",
    mediaView: "대표 연구 자료 보기",
    mediaPending: "대표 연구 자료 준비 중",
    empty: "선택한 연구분야의 연구실 정보가 아직 없습니다.",
  },
  en: {
    advisor: "Advisor",
    noEmail: "Not listed",
    noPhone: "Not listed",
    visitSite: "Visit website",
    research: "Representative Research",
    mediaView: "View research media",
    mediaPending: "Research media coming soon",
    empty: "No laboratory information is available for this field yet.",
  },
};

function LabCard({ lab, lang }: { lab: LabEntry; lang: Lang }) {
  const t = COPY[lang];
  return (
    <article className="rounded-lg border border-line p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted sm:h-20 sm:w-20">
          {lab.photoPath && (
            <Image src={lab.photoPath} alt="" width={80} height={80} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-ink sm:text-2xl">{lab.labNameEn ?? lab.name}</h3>
          <p className="mt-1 text-sm text-primary">
            {t.advisor} {lab.name} · {positionLabel(lab.position, lang)}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink/70">
            <span className="flex min-w-0 items-center gap-1.5">
              <MailIcon className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span className="truncate">{lab.email ?? t.noEmail}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="h-3.5 w-3.5 text-primary/70" />
              {lab.phone ?? t.noPhone}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink/70">
            {lab.office && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                {lab.office}
              </span>
            )}
            {lab.labUrl && (
              <a
                href={lab.labUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                {t.visitSite} →
              </a>
            )}
          </div>
        </div>
      </div>

      {lab.researchTitles.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">{t.research}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink/80">
            {lab.researchTitles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        {lab.researchMediaUrl ? (
          <a
            href={lab.researchMediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/5"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {t.mediaView} ↗
          </a>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink/50">
            <ImageOff className="h-4 w-4" aria-hidden="true" />
            {t.mediaPending}
          </div>
        )}
      </div>
    </article>
  );
}

export default function LabList({ lang, labs }: { lang: Lang; labs: LabEntry[] }) {
  const t = COPY[lang];
  const [displayed, setDisplayed] = useState(labs);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (labs === displayed) return;
    setFading(true);
    const timeout = window.setTimeout(() => {
      setDisplayed(labs);
      setFading(false);
    }, 220);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labs]);

  if (displayed.length === 0) {
    return (
      <div
        className={`rounded-lg border border-dashed border-line px-6 py-16 text-center text-ink/70 transition-opacity duration-200 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {t.empty}
      </div>
    );
  }

  return (
    <div
      className={`grid gap-5 transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {displayed.map((lab) => (
        <LabCard key={lab.slug} lab={lab} lang={lang} />
      ))}
    </div>
  );
}
