"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/nav";
import { fieldLabel, positionLabel, romanizedName, type FacultyMember } from "@/lib/faculty";
import { PhoneIcon, MailIcon } from "@/components/icons";
import TabRow from "@/components/ui/TabRow";
import SearchField from "@/components/ui/SearchField";

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
    <Link href={href} aria-label={`${member.name} ${t.detail}`} className="group block">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface-muted">
        {member.photoPath ? (
          <Image
            src={member.photoPath}
            alt=""
            width={480}
            height={480}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/25">
            <svg viewBox="0 0 40 40" className="h-12 w-12" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
              <path d="M20 4a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M20 4a4 4 0 0 0 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="font-display text-xl text-ink group-hover:text-primary">{member.name}</p>
        <p className="mt-0.5 text-sm text-ink/50">{positionLabel(member.position, lang)}</p>
        {member.field && <p className="mt-2 text-sm font-medium text-primary">{fieldLabel(member.field, lang)}</p>}

        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-ink/70">
          <span className="flex items-center gap-1.5">
            <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            {member.phone ?? t.noPhone}
          </span>
          {member.email && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MailIcon className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span className="truncate">{member.email}</span>
            </span>
          )}
        </div>
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
      <SearchField value={query} onChange={setQuery} placeholder={t.searchPlaceholder} className="max-w-md" />

      <div className="mt-5">
        <TabRow
          ariaLabel={lang === "ko" ? "연구분야 그룹" : "Research field groups"}
          value={active}
          onChange={setActive}
          items={[t.all, ...groups].map((g) => ({ value: g, label: g === t.all ? g : fieldLabel(g, lang) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <FacultyCard key={m.slug} member={m} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
