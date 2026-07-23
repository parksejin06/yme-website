"use client";

import { useState } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface AdmissionType {
  key: string;
  labelKr: string;
  labelEn: string;
  descKr: string;
  descEn: string;
  url: string;
  /** 요강 PDF 미리보기 (data/admissions-info.json). 매년 요강 갱신 시
   *  public/documents의 파일을 교체하고 src/연도 라벨만 함께 수정하면 됨. */
  guidePdf?: { src: string; yearKr: string; yearEn: string };
}

const COPY = {
  ko: {
    cta: "모집요강 페이지 바로가기",
    note: "최신 모집요강은 연세대학교 입학처 홈페이지에서 확인하세요.",
    pdfNotice: (year: string, label: string) =>
      `아래 미리보기는 ${year} ${label} 요강 기준입니다. 모집요강은 매년 갱신되므로 최신 내용은 반드시 위 입학처 링크에서 확인하세요.`,
    pdfTitle: (year: string, label: string) => `${year} ${label} 요강 미리보기`,
    expand: "전체 펼쳐보기",
    collapse: "접기",
    openNewTab: "새 탭에서 열기",
    download: "PDF 다운로드",
    mobileHint: "모바일에서는 미리보기 대신 아래 버튼으로 PDF를 확인해 주세요.",
  },
  en: {
    cta: "View Admissions Guide",
    note: "Please check the Yonsei University Admissions Office website for the current guide.",
    pdfNotice: (year: string, label: string) =>
      `The preview below is based on the ${year} ${label} guide. The guide is updated annually — always confirm the latest version via the Admissions Office link above.`,
    pdfTitle: (year: string, label: string) => `${label} guide preview (${year})`,
    expand: "Expand preview",
    collapse: "Collapse",
    openNewTab: "Open in new tab",
    download: "Download PDF",
    mobileHint: "On mobile, please use the buttons below instead of the inline preview.",
  },
};

function PdfPreview({
  pdf,
  typeLabel,
  lang,
}: {
  pdf: NonNullable<AdmissionType["guidePdf"]>;
  typeLabel: string;
  lang: Lang;
}) {
  const t = COPY[lang];
  const [expanded, setExpanded] = useState(false);
  const year = lang === "ko" ? pdf.yearKr : pdf.yearEn;
  const encodedSrc = encodeURI(pdf.src);

  return (
    <div className="mt-6 border-t border-line pt-6">
      <p className="text-xs leading-relaxed text-ink/50">{t.pdfNotice(year, typeLabel)}</p>

      {/* Desktop/tablet: inline PDF viewer. Browsers' built-in viewers handle
          iframe-embedded PDFs consistently; #view=FitH fits page width on
          Chromium. */}
      <div className="mt-4 hidden md:block">
        <div
          className="overflow-hidden rounded-lg border border-line bg-surface-muted/40 transition-[height] duration-300"
          style={{ height: expanded ? "1000px" : "640px" }}
        >
          <iframe
            src={`${encodedSrc}#view=FitH`}
            title={t.pdfTitle(year, typeLabel)}
            className="h-full w-full"
            loading="lazy"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-primary"
          >
            {expanded ? t.collapse : t.expand}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          <a
            href={encodedSrc}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.openNewTab} <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={encodedSrc}
            download
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.download} <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile: skip the embed (unreliable/tiny on phones) — offer links only */}
      <div className="mt-4 rounded-lg border border-line bg-surface-muted/60 p-4 md:hidden">
        <p className="text-xs text-ink/50">{t.mobileHint}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <a
            href={encodedSrc}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.openNewTab} <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={encodedSrc}
            download
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.download} <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdmissionTypeTabs({ types, lang }: { types: AdmissionType[]; lang: Lang }) {
  const [active, setActive] = useState(types[0].key);
  const selected = types.find((a) => a.key === active)!;
  const t = COPY[lang];

  return (
    <div>
      <div role="tablist" aria-label={lang === "ko" ? "전형 선택" : "Select admission type"} className="flex flex-wrap gap-1">
        {types.map((a) => (
          <button
            key={a.key}
            type="button"
            role="tab"
            aria-selected={active === a.key}
            onClick={() => setActive(a.key)}
            className={`min-h-11 rounded-md px-5 text-sm font-display transition-colors ${
              active === a.key ? "bg-primary text-white" : "border border-line text-ink/70 hover:border-primary-soft"
            }`}
          >
            {lang === "ko" ? a.labelKr : a.labelEn}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        <p className="text-ink/70">{lang === "ko" ? selected.descKr : selected.descEn}</p>

        <div className="mt-5 rounded-lg border border-line bg-surface-muted/60 p-4">
          <p className="text-xs text-ink/45">{t.note}</p>
          <a
            href={selected.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.cta} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {selected.guidePdf && (
          <PdfPreview
            key={selected.key}
            pdf={selected.guidePdf}
            typeLabel={lang === "ko" ? selected.labelKr : selected.labelEn}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}
