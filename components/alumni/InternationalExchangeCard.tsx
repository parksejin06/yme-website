import { ExternalLink } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface InternationalExchangeData {
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
  exampleNoticeKr: string;
  exampleNoticeEn: string;
  partnerUniversitiesHeadingKr: string;
  partnerUniversitiesHeadingEn: string;
  partnerUniversities: {
    countryKr: string;
    countryEn: string;
    universityNameKr: string;
    universityNameEn: string;
    period: string;
    typeKr: string;
    typeEn: string;
  }[];
  programsHeadingKr: string;
  programsHeadingEn: string;
  programs: { titleKr: string; titleEn: string; descKr: string; descEn: string }[];
  eventsHeadingKr: string;
  eventsHeadingEn: string;
  events: { nameKr: string; nameEn: string; period: string; locationKr: string; locationEn: string }[];
}

export default function InternationalExchangeCard({ data, lang }: { data: InternationalExchangeData; lang: Lang }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-lg text-ink">{lang === "ko" ? "국제 교류" : "International Exchange"}</h2>

      {/* 국제 학술·산업 교류 뉴스 카드 */}
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

      {/* 예시 데이터 안내 */}
      <p className="mt-8 rounded-lg border border-dashed border-accent/50 bg-accent/5 px-4 py-2.5 text-xs text-ink/60">
        {lang === "ko" ? data.exampleNoticeKr : data.exampleNoticeEn}
      </p>

      {/* 해외 협정 대학 (예시) */}
      <h3 className="mt-6 text-xs font-medium uppercase tracking-wide text-ink/45">
        {lang === "ko" ? data.partnerUniversitiesHeadingKr : data.partnerUniversitiesHeadingEn}
      </h3>
      <div className="mt-3 overflow-x-auto overflow-y-hidden rounded-lg border border-line">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-surface-muted text-left">
              <th className="px-4 py-2.5 font-display font-normal text-ink/70">{lang === "ko" ? "국가" : "Country"}</th>
              <th className="px-4 py-2.5 font-display font-normal text-ink/70">
                {lang === "ko" ? "협정 대학" : "University"}
              </th>
              <th className="px-4 py-2.5 font-display font-normal text-ink/70">{lang === "ko" ? "협정기간" : "Period"}</th>
              <th className="px-4 py-2.5 font-display font-normal text-ink/70">{lang === "ko" ? "협정형태" : "Type"}</th>
            </tr>
          </thead>
          <tbody>
            {data.partnerUniversities.map((u) => (
              <tr key={u.universityNameKr} className="border-t border-line">
                <td className="px-4 py-3 text-ink/70">{lang === "ko" ? u.countryKr : u.countryEn}</td>
                <td className="px-4 py-3 text-ink">{lang === "ko" ? u.universityNameKr : u.universityNameEn}</td>
                <td className="px-4 py-3 text-ink/70" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {u.period}
                </td>
                <td className="px-4 py-3 text-ink/70">{lang === "ko" ? u.typeKr : u.typeEn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 국제 교류 프로그램 (예시) */}
      <h3 className="mt-8 text-xs font-medium uppercase tracking-wide text-ink/45">
        {lang === "ko" ? data.programsHeadingKr : data.programsHeadingEn}
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {data.programs.map((p) => (
          <div key={p.titleKr} className="min-w-0 rounded-lg border border-line bg-surface-muted/60 p-4">
            <p className="font-display text-sm text-ink">{lang === "ko" ? p.titleKr : p.titleEn}</p>
            <p className="mt-1.5 text-sm text-ink/70">{lang === "ko" ? p.descKr : p.descEn}</p>
          </div>
        ))}
      </div>

      {/* 국제 행사·활동 (예시) */}
      <h3 className="mt-8 text-xs font-medium uppercase tracking-wide text-ink/45">
        {lang === "ko" ? data.eventsHeadingKr : data.eventsHeadingEn}
      </h3>
      <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
        {data.events.map((e) => (
          <li key={e.nameKr} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
            <span className="text-sm text-ink">{lang === "ko" ? e.nameKr : e.nameEn}</span>
            <span className="text-xs text-ink/50" style={{ fontVariantNumeric: "tabular-nums" }}>
              {e.period} · {lang === "ko" ? e.locationKr : e.locationEn}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
