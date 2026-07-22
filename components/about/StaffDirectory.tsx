"use client";

import { useMemo, useState } from "react";
import { Search, Phone, Mail } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface Staff {
  staffId: number;
  nameKo: string;
  team: string;
  phone: string;
  email: string;
  office: string;
  displayOrder: number;
}

const COPY = {
  ko: {
    searchPlaceholder: "이름, 담당업무로 검색",
    all: "전체",
    name: "이름",
    team: "담당업무",
    phone: "전화",
    email: "이메일",
    office: "위치",
    noResults: "검색 결과가 없습니다.",
  },
  en: {
    searchPlaceholder: "Search by name or team",
    all: "All",
    name: "Name",
    team: "Team",
    phone: "Phone",
    email: "Email",
    office: "Location",
    noResults: "No staff match your search.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function StaffDirectory({ staff, lang }: { staff: Staff[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const teams = useMemo(() => [...new Set(staff.map((s) => s.team))], [staff]);

  const filtered = staff
    .filter((s) => teamFilter === "all" || s.team === teamFilter)
    .filter((s) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [s.nameKo, s.team].join(" ").toLowerCase().includes(q);
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] max-w-md flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="min-h-12 w-full rounded-md border border-line bg-white pl-10 pr-3 text-base text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTeamFilter("all")} className={chipClass(teamFilter === "all")}>
            {t.all}
          </button>
          {teams.map((team) => (
            <button key={team} onClick={() => setTeamFilter(team)} className={chipClass(teamFilter === team)}>
              {team}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <>
          {/* Desktop/tablet: full directory table */}
          <div className="mt-8 hidden overflow-x-auto border border-line sm:block">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-muted text-left text-sm">
                  <th className="w-40 px-5 py-4 font-display font-normal text-ink/70">{t.name}</th>
                  <th className="px-5 py-4 font-display font-normal text-ink/70">{t.team}</th>
                  <th className="w-44 px-5 py-4 font-display font-normal text-ink/70">{t.phone}</th>
                  <th className="w-64 px-5 py-4 font-display font-normal text-ink/70">{t.email}</th>
                  <th className="w-40 px-5 py-4 font-display font-normal text-ink/70">{t.office}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.staffId} className="border-t border-line hover:bg-surface-muted/60">
                    <td className="px-5 py-5 font-display text-base text-ink">{s.nameKo}</td>
                    <td className="px-5 py-5 text-[15px] text-ink/70">{s.team}</td>
                    <td className="px-5 py-5">
                      <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2 text-[15px] text-ink/70 hover:text-primary">
                        <Phone className="h-4 w-4" aria-hidden="true" /> {s.phone}
                      </a>
                    </td>
                    <td className="px-5 py-5">
                      <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 text-[15px] text-ink/70 hover:text-primary">
                        <Mail className="h-4 w-4" aria-hidden="true" /> {s.email}
                      </a>
                    </td>
                    <td className="px-5 py-5 text-[15px] text-ink/70">{s.office}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <ul className="mt-8 divide-y divide-line border-y border-line sm:hidden">
            {filtered.map((s) => (
              <li key={s.staffId} className="py-4">
                <p className="font-display text-base text-ink">{s.nameKo}</p>
                <p className="mt-0.5 text-sm text-ink/50">
                  {s.team} · {s.office}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-primary">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {s.phone}
                  </a>
                  <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {s.email}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
