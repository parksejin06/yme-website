import Image from "next/image";
import { ExternalLink, ImageOff } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface IndustryProgram {
  key: string;
  titleKr: string;
  titleEn: string;
  descKr: string;
  descEn: string;
}

export interface FamilyCompany {
  nameKr: string;
  nameEn: string;
  logo: string | null;
}

export interface IndustryPartnersData {
  scopeNoteKr: string;
  scopeNoteEn: string;
  programs: IndustryProgram[];
  portalUrl: string;
  portalLabelKr: string;
  portalLabelEn: string;
  familyCompaniesHeadingKr: string;
  familyCompaniesHeadingEn: string;
  familyCompanies: FamilyCompany[];
}

const LOGO_PLACEHOLDER_COUNT = 4;

export default function IndustryCollaborationCard({ data, lang }: { data: IndustryPartnersData; lang: Lang }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-lg text-ink">{lang === "ko" ? "산학협력 현황" : "Industry-Academia Collaboration"}</h2>
      <p className="mt-2 text-xs text-ink/45">{lang === "ko" ? data.scopeNoteKr : data.scopeNoteEn}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {data.programs.map((p) => (
          <div key={p.key} className="rounded-lg border border-line bg-surface-muted/60 p-4">
            <p className="font-display text-sm text-ink">{lang === "ko" ? p.titleKr : p.titleEn}</p>
            <p className="mt-1.5 text-sm text-ink/70">{lang === "ko" ? p.descKr : p.descEn}</p>
          </div>
        ))}
      </div>

      <a
        href={data.portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {lang === "ko" ? data.portalLabelKr : data.portalLabelEn} <ExternalLink className="h-3.5 w-3.5" />
      </a>

      <h3 className="mt-8 text-xs font-medium uppercase tracking-wide text-ink/45">
        {lang === "ko" ? data.familyCompaniesHeadingKr : data.familyCompaniesHeadingEn}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.familyCompanies.length > 0
          ? data.familyCompanies.map((c) => (
              <div
                key={c.nameKr}
                className="flex h-20 items-center justify-center rounded-lg border border-line bg-surface-muted/60 p-3"
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={lang === "ko" ? c.nameKr : c.nameEn}
                    width={96}
                    height={40}
                    className="max-h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="text-center text-xs text-ink/60">{lang === "ko" ? c.nameKr : c.nameEn}</span>
                )}
              </div>
            ))
          : Array.from({ length: LOGO_PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-ink/35"
              >
                <ImageOff className="h-4 w-4" aria-hidden="true" />
                <span className="text-[11px]">{lang === "ko" ? "로고 준비 중" : "Logo pending"}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
