"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { romanizedName } from "@/lib/faculty";
import { MailIcon } from "@/components/icons";
import type { Lang } from "@/lib/nav";

export interface EmeritusFaculty {
  name: string;
  nameEn: string | null;
  field: string | null;
  tenure: string | null;
  email: string | null;
  photoPath: string | null;
  slug: string;
}

const COPY = {
  ko: {
    searchPlaceholder: "이름, 영문 표기, 전공으로 검색",
    noResults: "검색 결과가 없습니다.",
    field: "주요 전공·연구분야",
    tenure: "재직기간",
    email: "이메일",
  },
  en: {
    searchPlaceholder: "Search by name or field",
    noResults: "No faculty match your search.",
    field: "Field",
    tenure: "Tenure",
    email: "Email",
  },
};

function FallbackAvatar() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
      <svg viewBox="0 0 40 40" className="h-7 w-7 text-primary/30" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M20 4a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M20 4a4 4 0 0 0 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function EmeritusFacultyGrid({ faculty, lang }: { faculty: EmeritusFaculty[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<EmeritusFaculty | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faculty;
    return faculty.filter((f) =>
      [f.name, romanizedName(f.slug), f.field].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [faculty, query]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="min-h-12 w-full rounded-md border border-line bg-white pl-10 pr-9 text-base text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label={lang === "ko" ? "검색어 지우기" : "Clear search"}
            className="absolute right-0 top-1/2 flex h-12 w-10 -translate-y-1/2 items-center justify-center text-ink/30 hover:text-ink/60"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <ul className="mt-10 grid divide-y divide-line border-y border-line lg:grid-cols-2 lg:gap-x-10 lg:divide-y-0">
          {filtered.map((f) => (
            <li key={f.slug} className="lg:border-b lg:border-line">
              <button
                onClick={() => setSelected(f)}
                className="flex w-full items-center gap-5 py-5 text-left transition-colors hover:bg-surface-muted/60"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                  {f.photoPath ? (
                    <Image src={f.photoPath} alt="" width={64} height={64} className="h-full w-full object-cover" />
                  ) : (
                    <FallbackAvatar />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-ink">{f.name}</p>
                  <p className="mt-1 truncate text-sm text-ink/45">
                    {[f.field, f.tenure].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="emeritus-detail-title" panelClassName="max-w-md">
        {selected && (
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                {selected.photoPath ? (
                  <Image src={selected.photoPath} alt="" width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  <FallbackAvatar />
                )}
              </div>
              <div>
                <h3 id="emeritus-detail-title" className="font-display text-lg text-ink">
                  {selected.name}
                </h3>
                <p className="text-xs text-ink/45">{romanizedName(selected.slug)}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              {selected.field && (
                <div>
                  <dt className="text-xs text-ink/40">{t.field}</dt>
                  <dd className="mt-0.5 text-ink/80">{selected.field}</dd>
                </div>
              )}
              {selected.tenure && (
                <div>
                  <dt className="text-xs text-ink/40">{t.tenure}</dt>
                  <dd className="mt-0.5 text-ink/80">{selected.tenure}</dd>
                </div>
              )}
              {selected.email && (
                <div>
                  <dt className="text-xs text-ink/40">{t.email}</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-primary hover:underline">
                      <MailIcon className="h-3.5 w-3.5" />
                      {selected.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
