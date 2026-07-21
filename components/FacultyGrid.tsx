"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Lang } from "@/lib/nav";
import { fieldLabel, positionLabel, romanizedName, type FacultyMember } from "@/lib/faculty";
import { PhoneIcon, MailIcon } from "@/components/icons";

const COPY = {
  ko: {
    all: "전체",
    noPhone: "번호 미등록",
    detail: "상세보기",
    empty: "교수진 정보는 추후 제공 예정입니다. 그룹별 필터와 카드 레이아웃은 데이터 전달 즉시 반영됩니다.",
    searchPlaceholder: "이름, 영문 표기, 이메일, 연구실로 검색",
    noResults: "검색 결과가 없습니다.",
  },
  en: {
    all: "All",
    noPhone: "Not listed",
    detail: "View profile",
    empty: "Faculty information will be provided soon. Group filters and the card layout will populate as soon as data is available.",
    searchPlaceholder: "Search by name, email, or lab",
    noResults: "No faculty match your search.",
  },
};

function FacultyCard({ member, lang }: { member: FacultyMember; lang: Lang }) {
  const t = COPY[lang];
  const href = lang === "ko" ? `/faculty/${encodeURIComponent(member.slug)}` : `/en/faculty/${encodeURIComponent(member.slug)}`;

  return (
    <Link
      href={href}
      aria-label={`${member.name} ${t.detail}`}
      className="group relative flex gap-4 rounded-lg border border-line p-5 transition-colors hover:border-primary"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-muted sm:h-24 sm:w-24">
        {member.photoPath && (
          <Image
            src={member.photoPath}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display text-lg text-ink">{member.name}</p>
        <p className="text-sm text-ink/50">{positionLabel(member.position, lang)}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
          <span className="flex items-center gap-1.5">
            <PhoneIcon className="h-3.5 w-3.5 text-primary/70" />
            {member.phone ?? t.noPhone}
          </span>
          {member.email && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MailIcon className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span className="truncate">{member.email}</span>
            </span>
          )}
        </div>

        {member.labName && <p className="mt-2 truncate text-sm text-ink/70">{member.labName}</p>}
        {member.office && <p className="text-sm text-ink/70">{member.office}</p>}
        {member.field && <p className="mt-1 text-xs text-primary">{fieldLabel(member.field, lang)}</p>}

        <span className="mt-3 block text-right text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {t.detail} →
        </span>
      </div>
    </Link>
  );
}

export default function FacultyGrid({ lang, members }: { lang: Lang; members: FacultyMember[] }) {
  const t = COPY[lang];

  const groups = useMemo(() => {
    const set = new Set(members.map((m) => m.field).filter((g): g is string => Boolean(g)));
    return Array.from(set);
  }, [members]);

  const [active, setActive] = useState<string>(t.all);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = active === t.all ? members : members.filter((m) => m.field === active);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) =>
        [m.name, romanizedName(m.slug), m.email, m.labName].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return list;
  }, [members, active, query, t.all]);

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center text-ink/70">
        {t.empty}
      </div>
    );
  }

  return (
    <div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="min-h-11 w-full rounded-md border border-line bg-white pl-9 pr-8 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label={lang === "ko" ? "검색어 지우기" : "Clear search"}
            className="absolute right-0 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center text-ink/30 hover:text-ink/60"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        role="tablist"
        aria-label={lang === "ko" ? "연구분야 그룹" : "Research field groups"}
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {[t.all, ...groups].map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={active === g}
            onClick={() => setActive(g)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === g
                ? "border-primary bg-primary text-white"
                : "border-line text-ink/70 hover:border-primary hover:text-primary"
            }`}
          >
            {g === t.all ? g : fieldLabel(g, lang)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {filtered.map((m) => (
            <FacultyCard key={m.slug} member={m} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
