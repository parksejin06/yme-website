import { ExternalLink } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface AlumniAssociationInfo {
  introKr: string;
  introEn: string;
  ctaUrl: string;
  ctaLabelKr: string;
  ctaLabelEn: string;
}

export default function AlumniAssociationCard({ data, lang }: { data: AlumniAssociationInfo; lang: Lang }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-lg text-ink">
        {lang === "ko" ? "연세대학교 총동문회" : "Yonsei University Alumni Association"}
      </h2>
      <p className="mt-3 text-sm text-ink/70">{lang === "ko" ? data.introKr : data.introEn}</p>

      <a
        href={data.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
      >
        {lang === "ko" ? data.ctaLabelKr : data.ctaLabelEn} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
