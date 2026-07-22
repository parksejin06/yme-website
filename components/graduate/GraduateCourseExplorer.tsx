"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import SearchField from "@/components/ui/SearchField";
import SelectField from "@/components/ui/SelectField";
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
      <div className="flex items-start gap-2.5 rounded-md bg-surface-muted px-4 py-3 text-sm text-ink/65">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" aria-hidden="true" />
        <p>{t.areaDisclaimer}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SearchField value={query} onChange={setQuery} placeholder={t.searchPlaceholder} className="min-w-[240px] flex-1" />
        <SelectField
          ariaLabel={t.areaCol}
          value={areaFilter}
          onChange={setAreaFilter}
          options={[
            { value: "all", label: t.all },
            ...RESEARCH_AREAS.map((a) => ({ value: a.key, label: lang === "ko" ? a.labelKr : a.labelEn })),
            { value: "uncategorized", label: t.uncategorized },
          ]}
        />
      </div>

      <p className="mt-4 text-xs text-ink/45">
        {filtered.length}
        {t.courses}
      </p>

      <div className="mt-2 border-t border-line">
        {filtered.length > 0 && (
          <div className="hidden border-b border-line px-4 py-3 text-sm text-ink/40 sm:grid sm:grid-cols-[1fr_160px_200px_80px] sm:items-center sm:gap-3">
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
              className="grid grid-cols-1 gap-1 border-b border-line px-4 py-4 sm:grid-cols-[1fr_160px_200px_80px] sm:items-center sm:gap-3"
            >
              <span className="min-w-0">
                <span className="block truncate font-display text-[15px] text-ink sm:text-base">
                  {lang === "ko" ? c.nameKr : c.nameEn ?? c.nameKr}
                </span>
                {lang === "ko" && c.nameEn && <span className="block truncate text-sm text-ink/45">{c.nameEn}</span>}
                <span className="mt-0.5 block text-xs text-ink/45 sm:hidden">
                  {c.courseCode}
                  {areaLabel ? ` · ${areaLabel}` : ""} · {c.credit}
                  {t.credit}
                </span>
              </span>
              <span className="hidden text-sm text-ink/60 sm:block">{c.courseCode}</span>
              <span className="hidden text-sm text-ink/60 sm:block">{areaLabel ?? "—"}</span>
              <span className="hidden text-sm text-ink/70 sm:block">{c.credit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
