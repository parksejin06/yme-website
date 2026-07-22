"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import Collapse from "@/components/ui/Collapse";
import {
  YEAR_GROUPS,
  SEMESTERS,
  COURSE_TYPES,
  courseTypeMeta,
  yearLabelFromBucket,
  semesterLabelFromBucket,
  type Lang,
} from "@/lib/academics";

export interface CurriculumEntry {
  courseId: string;
  courseCode: string;
  nameKr: string;
  nameEn: string | null;
  bucket: string;
  spansBothSemesters: boolean;
  courseType: string;
  credit: number;
  lectureHours: number;
  practiceHours: number;
  category: string;
  researchArea: string | null;
  displayOrder: number;
  dataNote: string | null;
}

export interface CourseDetail {
  courseCode: string;
  description: string | null;
  hasDetail: boolean;
  keywords: string | null;
  relatedCourses: string | null;
}

const COPY = {
  ko: {
    banner: "※ 아래 커리큘럼은 참고용 공통 편성표이며, 학번별로 세부 편성이 다를 수 있습니다.",
    searchPlaceholder: "교과목명, 영문명, 학정번호로 검색",
    all: "전체",
    courseCol: "교과목명",
    codeCol: "학정번호",
    typeCol: "이수구분",
    creditCol: "학점",
    hoursCol: "강의/실습",
    courses: "개 교과목",
    searchResults: "검색 결과",
    noResults: "검색 결과가 없습니다.",
    credit: "학점",
    yearSemester: "학년·학기",
    nameEn: "영문 교과목명",
    keywords: "핵심 키워드",
    related: "관련 교과목",
    researchArea: "관련 연구분야",
  },
  en: {
    banner: "※ The curriculum below is a common reference plan; actual course offerings may vary by cohort year.",
    searchPlaceholder: "Search by course name or course code",
    all: "All",
    courseCol: "Course",
    codeCol: "Course Code",
    typeCol: "Category",
    creditCol: "Credits",
    hoursCol: "Lecture/Lab",
    courses: " courses",
    searchResults: "Search results",
    noResults: "No courses match your search.",
    credit: " credits",
    yearSemester: "Year / Semester",
    nameEn: "English Course Name",
    keywords: "Keywords",
    related: "Related Courses",
    researchArea: "Related Research Area",
  },
};

const GRID_COLS = "sm:grid-cols-[1fr_140px_120px_80px_100px_24px]";

function chipClass(active: boolean) {
  return `inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors ${
    active
      ? "border-primary bg-primary text-white"
      : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"
  }`;
}

export default function CourseExplorer({
  entries,
  courseMap,
  lang,
}: {
  entries: CurriculumEntry[];
  courseMap: Map<string, CourseDetail>;
  lang: Lang;
}) {
  const t = COPY[lang];
  const [year, setYear] = useState(YEAR_GROUPS[0].key);
  const [semester, setSemester] = useState(SEMESTERS[0].key);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openCode, setOpenCode] = useState<string | null>(null);

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const filtered = useMemo(() => {
    let list = entries;
    if (isSearching) {
      list = list.filter((e) => {
        const detail = courseMap.get(e.courseCode);
        const haystack = [e.nameKr, e.nameEn, e.courseCode, detail?.keywords].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(trimmedQuery);
      });
    } else {
      list = list.filter((e) => {
        const [y, s] = e.bucket.split("-");
        return y === year && s === semester;
      });
    }
    if (typeFilter !== "all") {
      list = list.filter((e) => e.courseType === typeFilter);
    }
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [entries, courseMap, isSearching, trimmedQuery, year, semester, typeFilter]);

  const activeYearLabel = YEAR_GROUPS.find((g) => g.key === year);
  const activeSemesterLabel = SEMESTERS.find((s) => s.key === semester);

  return (
    <div>
      <p className="text-xs text-ink/40">{t.banner}</p>

      {/* Year tabs */}
      <div
        role="tablist"
        aria-label={lang === "ko" ? "학년 선택" : "Select year"}
        className="mt-6 flex gap-1 overflow-x-auto"
      >
        {YEAR_GROUPS.map((g) => (
          <button
            key={g.key}
            role="tab"
            aria-selected={!isSearching && year === g.key}
            onClick={() => {
              setYear(g.key);
              setQuery("");
            }}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-md px-4 text-sm font-display transition-colors ${
              !isSearching && year === g.key
                ? "bg-primary text-white"
                : "text-ink/60 hover:bg-surface-muted hover:text-ink"
            }`}
          >
            {lang === "ko" ? g.labelKr : g.labelEn}
          </button>
        ))}
      </div>

      {/* Semester + search + type filter */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label={lang === "ko" ? "학기 선택" : "Select semester"} className="inline-flex shrink-0 rounded-md border border-line p-0.5">
          {SEMESTERS.map((s) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={!isSearching && semester === s.key}
              onClick={() => {
                setSemester(s.key);
                setQuery("");
              }}
              className={`inline-flex min-h-11 items-center justify-center rounded px-3 text-xs font-medium transition-colors ${
                !isSearching && semester === s.key ? "bg-primary-strong text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {lang === "ko" ? s.labelKr : s.labelEn}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] flex-1">
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

        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTypeFilter("all")} className={chipClass(typeFilter === "all")}>
            {t.all}
          </button>
          {COURSE_TYPES.map((ct) => (
            <button key={ct.key} onClick={() => setTypeFilter(ct.key)} className={chipClass(typeFilter === ct.key)}>
              {lang === "ko" ? ct.labelKr : ct.labelEn}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink/45">
        {isSearching
          ? t.searchResults
          : `${lang === "ko" ? activeYearLabel?.labelKr : activeYearLabel?.labelEn} · ${
              lang === "ko" ? activeSemesterLabel?.labelKr : activeSemesterLabel?.labelEn
            }`}
        {" · "}
        {filtered.length}
        {t.courses}
      </p>

      <div className="mt-2 border-t border-line">
        {filtered.length > 0 && (
          <div className={`hidden border-b border-line px-4 py-3 text-sm text-ink/40 sm:grid sm:items-center sm:gap-3 ${GRID_COLS}`}>
            <span>{t.courseCol}</span>
            <span>{t.codeCol}</span>
            <span>{t.typeCol}</span>
            <span>{t.creditCol}</span>
            <span>{t.hoursCol}</span>
            <span />
          </div>
        )}

        {filtered.length === 0 && <p className="px-4 py-14 text-center text-sm text-ink/40">{t.noResults}</p>}

        {filtered.map((c) => {
          const detail = courseMap.get(c.courseCode);
          const open = openCode === c.courseCode;
          const meta = courseTypeMeta(c.courseType);
          const typeLabel = meta ? (lang === "ko" ? meta.labelKr : meta.labelEn) : c.courseType;

          return (
            <div key={c.courseId} className="border-b border-line">
              <button
                onClick={() => setOpenCode(open ? null : c.courseCode)}
                aria-expanded={open}
                className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-muted sm:py-4 ${GRID_COLS}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-[15px] text-ink sm:text-base">
                    {lang === "ko" ? c.nameKr : c.nameEn ?? c.nameKr}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/45 sm:hidden">
                    {typeLabel} · {c.credit}
                    {t.credit} · {c.courseCode}
                  </span>
                </span>

                <span className="hidden text-sm text-ink/60 sm:block">{c.courseCode}</span>
                <span className="hidden sm:block">
                  {meta && (
                    <span className={`inline-flex rounded px-2.5 py-1 text-xs font-medium ${meta.badgeClass}`}>
                      {typeLabel}
                    </span>
                  )}
                </span>
                <span className="hidden text-sm text-ink/70 sm:block">{c.credit}</span>
                <span className="hidden text-sm text-ink/50 sm:block">
                  {c.lectureHours}/{c.practiceHours}
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-ink/35 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <Collapse open={open}>
                <div className="space-y-3 bg-surface-muted/60 px-4 py-4 sm:px-5">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:grid-cols-4">
                      <div>
                        <dt className="text-ink/40">{t.codeCol}</dt>
                        <dd className="mt-0.5 text-ink/80">{c.courseCode}</dd>
                      </div>
                      <div>
                        <dt className="text-ink/40">{t.typeCol}</dt>
                        <dd className="mt-0.5 text-ink/80">{typeLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-ink/40">{t.creditCol}</dt>
                        <dd className="mt-0.5 text-ink/80">
                          {c.credit}
                          {t.credit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink/40">{t.yearSemester}</dt>
                        <dd className="mt-0.5 text-ink/80">
                          {yearLabelFromBucket(c.bucket, lang)} · {semesterLabelFromBucket(c.bucket, lang)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink/40">{t.hoursCol}</dt>
                        <dd className="mt-0.5 text-ink/80">
                          {c.lectureHours} / {c.practiceHours}
                        </dd>
                      </div>
                      {c.nameEn && (
                        <div className="col-span-2 sm:col-span-2">
                          <dt className="text-ink/40">{t.nameEn}</dt>
                          <dd className="mt-0.5 text-ink/80">{c.nameEn}</dd>
                        </div>
                      )}
                    </dl>

                    {detail?.hasDetail && detail.description && (
                      <p className="text-sm leading-relaxed text-ink/75">{detail.description}</p>
                    )}
                    {detail?.keywords && (
                      <p className="text-xs text-ink/50">
                        <span className="text-ink/40">{t.keywords}:</span> {detail.keywords}
                      </p>
                    )}
                    {c.researchArea && (
                      <p className="text-xs text-ink/50">
                        <span className="text-ink/40">{t.researchArea}:</span> {c.researchArea}
                      </p>
                    )}
                    {detail?.relatedCourses && (
                      <p className="text-xs text-ink/50">
                        <span className="text-ink/40">{t.related}:</span> {detail.relatedCourses}
                      </p>
                    )}
                    {c.dataNote && <p className="text-xs italic text-ink/40">※ {c.dataNote}</p>}
                </div>
              </Collapse>
            </div>
          );
        })}
      </div>
    </div>
  );
}
