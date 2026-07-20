"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { RESEARCH_AREAS, researchAreaLabel, type GraduateCourse } from "@/lib/graduate";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    searchPlaceholder: "과목명, 영문명, 학정번호로 검색",
    all: "전체",
    uncategorized: "미분류",
    courseCol: "과목명",
    codeCol: "학정번호",
    areaCol: "연구분야",
    creditCol: "학점",
    courses: "개 교과목",
    noResults: "검색 결과가 없습니다.",
    credit: "학점",
    areaDisclaimer: "※ 연구분야는 과목명 기반의 참고용 분류이며, 공식 분류 자료가 아닙니다.",
  },
  en: {
    searchPlaceholder: "Search by course name or course code",
    all: "All",
    uncategorized: "Uncategorized",
    courseCol: "Course",
    codeCol: "Course Code",
    areaCol: "Research Area",
    creditCol: "Credits",
    courses: " courses",
    noResults: "No courses match your search.",
    credit: " credits",
    areaDisclaimer: "※ Research areas are a reference classification derived from course names, not official department data.",
  },
};

function chipClass(active: boolean) {
  return `inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function GraduateCourseExplorer({ courses, lang }: { courses: GraduateCourse[]; lang: Lang }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = courses;
    if (q) {
      list = list.filter((c) => [c.nameKr, c.nameEn, c.courseCode].filter(Boolean).join(" ").toLowerCase().includes(q));
    }
    if (areaFilter !== "all") {
      list = list.filter((c) => (areaFilter === "uncategorized" ? !c.researchArea : c.researchArea === areaFilter));
    }
    return list;
  }, [courses, query, areaFilter]);

  return (
    <div>
      <p className="text-xs text-ink/40">{t.areaDisclaimer}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
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
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button onClick={() => setAreaFilter("all")} className={chipClass(areaFilter === "all")}>
          {t.all}
        </button>
        {RESEARCH_AREAS.map((a) => (
          <button key={a.key} onClick={() => setAreaFilter(a.key)} className={chipClass(areaFilter === a.key)}>
            {lang === "ko" ? a.labelKr : a.labelEn}
          </button>
        ))}
        <button onClick={() => setAreaFilter("uncategorized")} className={chipClass(areaFilter === "uncategorized")}>
          {t.uncategorized}
        </button>
      </div>

      <p className="mt-4 text-xs text-ink/45">
        {filtered.length}
        {t.courses}
      </p>

      <div className="mt-2 border-t border-line">
        {filtered.length > 0 && (
          <div className="hidden border-b border-line px-4 py-2 text-xs text-ink/40 sm:grid sm:grid-cols-[1fr_140px_160px_64px] sm:items-center sm:gap-3">
            <span>{t.courseCol}</span>
            <span>{t.codeCol}</span>
            <span>{t.areaCol}</span>
            <span>{t.creditCol}</span>
          </div>
        )}

        {filtered.length === 0 && <p className="px-4 py-14 text-center text-sm text-ink/40">{t.noResults}</p>}

        {filtered.map((c) => {
          const areaLabel = researchAreaLabel(c.researchArea, lang);
          return (
            <div
              key={c.courseCode}
              className="grid grid-cols-1 gap-1 border-b border-line px-4 py-3.5 sm:grid-cols-[1fr_140px_160px_64px] sm:items-center sm:gap-3 sm:py-3"
            >
              <span className="min-w-0">
                <span className="block truncate font-display text-[15px] text-ink sm:text-sm">
                  {lang === "ko" ? c.nameKr : c.nameEn ?? c.nameKr}
                </span>
                {lang === "ko" && c.nameEn && <span className="block truncate text-xs text-ink/45">{c.nameEn}</span>}
                <span className="mt-0.5 block text-xs text-ink/45 sm:hidden">
                  {c.courseCode}
                  {areaLabel ? ` · ${areaLabel}` : ""} · {c.credit}
                  {t.credit}
                </span>
              </span>
              <span className="hidden text-xs text-ink/60 sm:block">{c.courseCode}</span>
              <span className="hidden text-xs text-ink/60 sm:block">{areaLabel ?? "—"}</span>
              <span className="hidden text-sm text-ink/70 sm:block">{c.credit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
