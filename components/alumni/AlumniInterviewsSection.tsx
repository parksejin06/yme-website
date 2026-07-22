import Image from "next/image";
import type { Lang } from "@/lib/nav";

export interface AlumniInterview {
  nameKr: string;
  nameEn: string;
  cohortKr: string;
  cohortEn: string;
  quoteKr: string;
  quoteEn: string;
  photo: string | null;
}

export default function AlumniInterviewsSection({
  interviews,
  lang,
}: {
  interviews: AlumniInterview[];
  lang: Lang;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map((it) => {
        const name = lang === "ko" ? it.nameKr : it.nameEn;
        return (
          <div key={it.nameKr} className="flex min-w-0 flex-col rounded-lg border border-line bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-display text-base text-primary/70">
                {it.photo ? (
                  <Image src={it.photo} alt="" width={48} height={48} className="h-full w-full object-cover" />
                ) : (
                  name.slice(0, 1)
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm text-ink">{name}</p>
                <p className="truncate text-xs text-ink/50">{lang === "ko" ? it.cohortKr : it.cohortEn}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              &ldquo;{lang === "ko" ? it.quoteKr : it.quoteEn}&rdquo;
            </p>
          </div>
        );
      })}
    </div>
  );
}
