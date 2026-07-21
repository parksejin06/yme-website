"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface AdmissionType {
  key: string;
  labelKr: string;
  labelEn: string;
  descKr: string;
  descEn: string;
  url: string;
}

const COPY = {
  ko: { cta: "모집요강 페이지 바로가기", note: "최신 모집요강은 연세대학교 입학처 홈페이지에서 확인하세요." },
  en: { cta: "View Admissions Guide", note: "Please check the Yonsei University Admissions Office website for the current guide." },
};

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
      </div>
    </div>
  );
}
