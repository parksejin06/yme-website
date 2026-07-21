import { ExternalLink } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface GlobalPartnershipsData {
  news: {
    badgeKr: string;
    badgeEn: string;
    dateKr: string;
    dateEn: string;
    titleKr: string;
    titleEn: string;
    descKr: string;
    descEn: string;
    sourceUrl: string;
    linkLabelKr: string;
    linkLabelEn: string;
  };
  gradSchoolExchange: {
    titleKr: string;
    titleEn: string;
    descKr: string;
    descEn: string;
    sourceUrl: string;
    linkLabelKr: string;
    linkLabelEn: string;
  };
  keioNote: {
    titleKr: string;
    titleEn: string;
    descKr: string;
    descEn: string;
  };
  mouHeadingKr: string;
  mouHeadingEn: string;
  mouPendingNoticeKr: string;
  mouPendingNoticeEn: string;
  mouPartners: { nameKr: string; nameEn: string; logo: string | null }[];
}

export default function GlobalPartnershipsCard({ data, lang }: { data: GlobalPartnershipsData; lang: Lang }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-lg text-ink">{lang === "ko" ? "대외협력·MOU" : "Partnerships & MOUs"}</h2>

      {/* 국제 학술·산업 교류 뉴스 카드 — 최근 소식 뱃지로 강조 */}
      <a
        href={data.news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block rounded-lg border border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/60"
      >
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
            {lang === "ko" ? data.news.badgeKr : data.news.badgeEn}
          </span>
          <span className="text-xs text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
            {lang === "ko" ? data.news.dateKr : data.news.dateEn}
          </span>
        </div>
        <p className="mt-2 font-display text-sm text-ink">{lang === "ko" ? data.news.titleKr : data.news.titleEn}</p>
        <p className="mt-1.5 text-sm text-ink/70">{lang === "ko" ? data.news.descKr : data.news.descEn}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
          {lang === "ko" ? data.news.linkLabelKr : data.news.linkLabelEn} <ExternalLink className="h-3 w-3" />
        </span>
      </a>

      {/* 정적 설명 섹션들 */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface-muted/60 p-4">
          <p className="font-display text-sm text-ink">
            {lang === "ko" ? data.gradSchoolExchange.titleKr : data.gradSchoolExchange.titleEn}
          </p>
          <p className="mt-1.5 text-sm text-ink/70">
            {lang === "ko" ? data.gradSchoolExchange.descKr : data.gradSchoolExchange.descEn}
          </p>
          <a
            href={data.gradSchoolExchange.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {lang === "ko" ? data.gradSchoolExchange.linkLabelKr : data.gradSchoolExchange.linkLabelEn}{" "}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-lg border border-line bg-surface-muted/60 p-4">
          <p className="font-display text-sm text-ink">{lang === "ko" ? data.keioNote.titleKr : data.keioNote.titleEn}</p>
          <p className="mt-1.5 text-sm text-ink/70">{lang === "ko" ? data.keioNote.descKr : data.keioNote.descEn}</p>
        </div>
      </div>

      {/* 학과 개별 MOU */}
      <h3 className="mt-8 text-xs font-medium uppercase tracking-wide text-ink/45">
        {lang === "ko" ? data.mouHeadingKr : data.mouHeadingEn}
      </h3>
      {data.mouPartners.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-ink/50">
          {lang === "ko" ? data.mouPendingNoticeKr : data.mouPendingNoticeEn}
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.mouPartners.map((p) => (
            <li
              key={p.nameKr}
              className="rounded-lg border border-line bg-surface-muted/60 px-3 py-2 text-center text-sm text-ink/75"
            >
              {lang === "ko" ? p.nameKr : p.nameEn}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
