"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, LayoutGrid, List } from "lucide-react";
import { courseTypeMeta, YEAR_GROUPS, SEMESTERS } from "@/lib/academics";
import { FIELD_ROWS, MAP_COLUMNS, rowForEntry, rowLabel, relatedCodesFor, type FieldRow } from "@/lib/curriculumMap";
import CourseDetailDrawer from "@/components/undergraduate/CourseDetailDrawer";
import TabRow from "@/components/ui/TabRow";
import SearchField from "@/components/ui/SearchField";
import type { CurriculumEntry, CourseDetail } from "@/components/academics/CourseExplorer";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    intro: "학년·학기와 분야를 따라 기계공학부의 교과목 흐름을 확인할 수 있습니다. 교과목을 선택하면 상세정보와 관련 과목이 표시됩니다.",
    searchPlaceholder: "교과목명, 학정번호로 검색",
    all: "전체",
    required: "전공필수",
    elective: "전공선택",
    noResults: "검색 결과가 없습니다.",
    fullMap: "전체 체계도 보기",
    backToList: "목록으로",
    zoomOut: "축소",
    zoomIn: "확대",
    reset: "초기화",
    credit: "학점",
  },
  en: {
    intro: "Follow the year, semester, and field to see how Yonsei ME courses connect. Select a course to see its details and related courses.",
    searchPlaceholder: "Search by course name or code",
    all: "All",
    required: "Required",
    elective: "Elective",
    noResults: "No courses match your search.",
    fullMap: "View full map",
    backToList: "Back to list",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    reset: "Reset",
    credit: " credits",
  },
};

const ZOOM_STEPS = [
  { col: "128px", font: "text-[11px]", pad: "px-2 py-1.5" },
  { col: "160px", font: "text-xs", pad: "px-2.5 py-2" },
  { col: "196px", font: "text-[13px]", pad: "px-3 py-2.5" },
];

interface NodeState {
  lang: Lang;
  zoomLevel: number;
  isDimmed: (entry: CurriculumEntry) => boolean;
  relatedSet: Set<string> | null;
  onSelect: (code: string) => void;
  creditLabel: string;
}

function CourseNode({ entry, state }: { entry: CurriculumEntry; state: NodeState }) {
  const { lang, zoomLevel, isDimmed, relatedSet, onSelect, creditLabel } = state;
  const zoom = ZOOM_STEPS[zoomLevel];
  const meta = courseTypeMeta(entry.courseType);
  const row = rowForEntry(entry);
  const required = entry.courseType === "전필";
  const dimmed = isDimmed(entry);
  const related = relatedSet?.has(entry.courseCode) ?? false;
  const name = lang === "ko" ? entry.nameKr : entry.nameEn ?? entry.nameKr;
  const typeLabel = meta ? (lang === "ko" ? meta.labelKr : meta.labelEn) : entry.courseType;

  return (
    <button
      onClick={() => onSelect(entry.courseCode)}
      aria-label={`${entry.nameKr}, ${typeLabel}, ${entry.credit}${creditLabel}`}
      style={
        required ? { backgroundColor: row.color, borderColor: row.color } : { borderColor: row.color, color: row.color }
      }
      className={`block w-full rounded ${zoom.pad} ${zoom.font} border font-medium leading-snug text-left transition-all duration-200 ${
        required ? "text-white" : "bg-white"
      } ${dimmed ? "opacity-25" : "opacity-100"} ${related ? "ring-2 ring-offset-1 ring-primary" : ""}`}
    >
      <span className="line-clamp-2">{name}</span>
    </button>
  );
}

function FieldRowCells({ row, entries, lang, state }: { row: FieldRow; entries: CurriculumEntry[]; lang: Lang; state: NodeState }) {
  const rowEntries = entries.filter((e) => rowForEntry(e).key === row.key);

  return (
    <>
      <div className="sticky left-0 z-10 flex items-center border-b border-r border-line bg-white px-2.5 py-2">
        <span className="flex items-center gap-1.5 text-xs font-display text-ink/75">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
          <span className="leading-tight">{rowLabel(row, lang)}</span>
        </span>
      </div>
      {MAP_COLUMNS.map((col) => {
        const cellEntries = rowEntries
          .filter((e) => e.bucket === col.bucket)
          .sort((a, b) => a.displayOrder - b.displayOrder);
        return (
          <div key={col.bucket} className="space-y-1.5 border-b border-l border-line p-1.5">
            {cellEntries.map((e) => (
              <CourseNode key={e.courseId} entry={e} state={state} />
            ))}
          </div>
        );
      })}
    </>
  );
}

export default function CurriculumMap({
  entries,
  courseMap,
  lang,
}: {
  entries: CurriculumEntry[];
  courseMap: Map<string, CourseDetail>;
  lang: Lang;
}) {
  const t = COPY[lang];
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mobileFullMap, setMobileFullMap] = useState(false);
  const [mobileYear, setMobileYear] = useState(YEAR_GROUPS[0].key);
  const [mobileSemester, setMobileSemester] = useState(SEMESTERS[0].key);

  const selectedEntry = entries.find((e) => e.courseCode === selectedCode) ?? null;
  const trimmedQuery = query.trim().toLowerCase();

  const searchMatches = useMemo(() => {
    if (!trimmedQuery) return null;
    return new Set(
      entries
        .filter((e) => {
          const detail = courseMap.get(e.courseCode);
          const hay = [e.nameKr, e.nameEn, e.courseCode, detail?.keywords].filter(Boolean).join(" ").toLowerCase();
          return hay.includes(trimmedQuery);
        })
        .map((e) => e.courseCode)
    );
  }, [trimmedQuery, entries, courseMap]);

  const relatedSet = useMemo(() => {
    if (!selectedCode) return null;
    return new Set([selectedCode, ...relatedCodesFor(selectedCode)]);
  }, [selectedCode]);

  function isDimmed(entry: CurriculumEntry) {
    if (fieldFilter !== "all" && rowForEntry(entry).key !== fieldFilter) return true;
    if (typeFilter !== "all" && entry.courseType !== typeFilter) return true;
    if (searchMatches && !searchMatches.has(entry.courseCode)) return true;
    return false;
  }

  const hasSearchResults = !searchMatches || searchMatches.size > 0;

  const nodeState: NodeState = {
    lang,
    zoomLevel,
    isDimmed,
    relatedSet,
    onSelect: setSelectedCode,
    creditLabel: t.credit,
  };

  return (
    <div>
      <p className="max-w-2xl text-sm text-ink/60">{t.intro}</p>

      {/* Controls */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder={t.searchPlaceholder} className="min-w-[220px] max-w-sm flex-1" />

        <TabRow
          ariaLabel={lang === "ko" ? "이수구분 선택" : "Select course type"}
          size="sm"
          value={typeFilter}
          onChange={setTypeFilter}
          items={[
            { value: "all", label: t.all },
            { value: "전필", label: t.required },
            { value: "전선", label: t.elective },
          ]}
        />
      </div>

      <div className="mt-4">
        <TabRow
          ariaLabel={lang === "ko" ? "분야 선택" : "Select field"}
          size="sm"
          value={fieldFilter}
          onChange={setFieldFilter}
          items={[{ value: "all", label: t.all }, ...FIELD_ROWS.map((r) => ({ value: r.key, label: rowLabel(r, lang) }))]}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-ink/60">
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-5 rounded-sm bg-ink/70" /> {t.required}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-5 rounded-sm border-2 border-ink/70 bg-white" /> {t.elective}
        </span>
        {FIELD_ROWS.map((r) => (
          <span key={r.key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
            {rowLabel(r, lang)}
          </span>
        ))}
      </div>

      {!hasSearchResults && <p className="mt-6 text-sm text-ink/40">{t.noResults}</p>}

      {/* Desktop / tablet grid (also shown on mobile when "full map" is toggled) */}
      <div className={`${mobileFullMap ? "block" : "hidden"} sm:block`}>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0, z - 1))}
              disabled={zoomLevel === 0}
              aria-label={t.zoomOut}
              className="flex h-8 w-8 items-center justify-center rounded border border-line text-ink/60 disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              aria-label={t.reset}
              className="flex h-8 w-8 items-center justify-center rounded border border-line text-ink/60"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 1))}
              disabled={zoomLevel === 2}
              aria-label={t.zoomIn}
              className="flex h-8 w-8 items-center justify-center rounded border border-line text-ink/60 disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => setMobileFullMap(false)}
            className="flex min-h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs text-ink/60 sm:hidden"
          >
            <List className="h-3.5 w-3.5" /> {t.backToList}
          </button>
        </div>

        <div className="relative mt-3 max-h-[70vh] overflow-auto rounded-lg border border-line">
          <div className="grid" style={{ gridTemplateColumns: `112px repeat(${MAP_COLUMNS.length}, ${ZOOM_STEPS[zoomLevel].col})` }}>
            <div className="sticky left-0 top-0 z-30 border-b border-r border-line bg-white" />
            {MAP_COLUMNS.map((col) => (
              <div
                key={col.bucket}
                className="sticky top-0 z-20 border-b border-l border-line bg-white px-2 py-2.5 text-center text-[11px] font-display text-ink/70"
              >
                {lang === "ko" ? col.labelKr : col.labelEn}
              </div>
            ))}

            {FIELD_ROWS.map((row) => (
              <FieldRowCells key={row.key} row={row} entries={entries} lang={lang} state={nodeState} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile vertical navigator */}
      <div className={`${mobileFullMap ? "hidden" : "block"} mt-6 sm:hidden`}>
        <div className="flex gap-1 overflow-x-auto">
          {YEAR_GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setMobileYear(g.key)}
              className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-display transition-colors ${
                mobileYear === g.key ? "bg-primary text-white" : "text-ink/60"
              }`}
            >
              {lang === "ko" ? g.labelKr : g.labelEn}
            </button>
          ))}
        </div>
        <div className="mt-2 inline-flex rounded-md border border-line p-0.5">
          {SEMESTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setMobileSemester(s.key)}
              className={`min-h-11 rounded px-3.5 text-sm font-medium ${
                mobileSemester === s.key ? "bg-primary-strong text-white" : "text-ink/60"
              }`}
            >
              {lang === "ko" ? s.labelKr : s.labelEn}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {entries
            .filter((e) => {
              const [y, s] = e.bucket.split("-");
              return y === mobileYear && s === mobileSemester;
            })
            .filter((e) => fieldFilter === "all" || rowForEntry(e).key === fieldFilter)
            .filter((e) => typeFilter === "all" || e.courseType === typeFilter)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((e) => {
              const row = rowForEntry(e);
              const meta = courseTypeMeta(e.courseType);
              return (
                <button
                  key={e.courseId}
                  onClick={() => setSelectedCode(e.courseCode)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-line px-4 py-3.5 text-left"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="truncate font-display text-sm text-ink">{lang === "ko" ? e.nameKr : e.nameEn ?? e.nameKr}</span>
                    </span>
                    <span className="mt-1 block text-xs text-ink/45">
                      {meta ? (lang === "ko" ? meta.labelKr : meta.labelEn) : e.courseType} · {e.credit}
                      {t.credit}
                    </span>
                  </span>
                </button>
              );
            })}
        </div>

        <button
          onClick={() => setMobileFullMap(true)}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line text-sm text-ink/70"
        >
          <LayoutGrid className="h-4 w-4" /> {t.fullMap}
        </button>
      </div>

      <CourseDetailDrawer
        entry={selectedEntry}
        courseMap={courseMap}
        allEntries={entries}
        lang={lang}
        onClose={() => setSelectedCode(null)}
        onSelectCode={setSelectedCode}
      />
    </div>
  );
}
