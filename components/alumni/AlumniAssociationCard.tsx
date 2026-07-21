import Link from "next/link";
import { localizePath, type Lang } from "@/lib/nav";

export interface AlumniInfo {
  status: string;
  introKr: string;
  introEn: string;
  pendingNoticeKr: string;
  pendingNoticeEn: string;
  contactCtaKr: string;
  contactCtaEn: string;
}

export default function AlumniAssociationCard({ data, lang }: { data: AlumniInfo; lang: Lang }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-lg text-ink">{lang === "ko" ? "동문회 소개" : "Alumni Association"}</h2>
      <p className="mt-3 text-sm text-ink/70">{lang === "ko" ? data.introKr : data.introEn}</p>

      {data.status === "draft" && (
        <p className="mt-4 rounded-lg border border-dashed border-line px-4 py-3 text-xs text-ink/50">
          {lang === "ko" ? data.pendingNoticeKr : data.pendingNoticeEn}
        </p>
      )}

      <Link
        href={localizePath("/about/directions", lang)}
        className="mt-5 inline-block rounded-full border border-line px-4 py-2 text-xs font-medium text-ink/75 transition-colors hover:border-primary hover:text-primary"
      >
        {lang === "ko" ? data.contactCtaKr : data.contactCtaEn}
      </Link>
    </div>
  );
}
