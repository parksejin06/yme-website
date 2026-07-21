"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { courseTypeMeta, yearLabelFromBucket, semesterLabelFromBucket } from "@/lib/academics";
import { rowForEntry, rowLabel, relatedCodesFor } from "@/lib/curriculumMap";
import type { CurriculumEntry, CourseDetail } from "@/components/academics/CourseExplorer";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    code: "학정번호",
    type: "이수구분",
    credit: "학점",
    yearSemester: "학년·학기",
    hours: "강의/실습",
    nameEn: "영문 교과목명",
    field: "관련 분야",
    keywords: "핵심 키워드",
    related: "관련 교과목",
    close: "닫기",
  },
  en: {
    code: "Course Code",
    type: "Category",
    credit: "Credits",
    yearSemester: "Year / Semester",
    hours: "Lecture/Lab",
    nameEn: "English Name",
    field: "Field",
    keywords: "Keywords",
    related: "Related Courses",
    close: "Close",
  },
};

export default function CourseDetailDrawer({
  entry,
  courseMap,
  allEntries,
  lang,
  onClose,
  onSelectCode,
}: {
  entry: CurriculumEntry | null;
  courseMap: Map<string, CourseDetail>;
  allEntries: CurriculumEntry[];
  lang: Lang;
  onClose: () => void;
  onSelectCode: (code: string) => void;
}) {
  const t = COPY[lang];
  const open = !!entry;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const detail = entry ? courseMap.get(entry.courseCode) : null;
  const meta = entry ? courseTypeMeta(entry.courseType) : null;
  const row = entry ? rowForEntry(entry) : null;
  const relatedCodes = entry ? relatedCodesFor(entry.courseCode) : [];
  const relatedEntries = relatedCodes
    .map((code) => allEntries.find((e) => e.courseCode === code))
    .filter((e): e is CurriculumEntry => !!e);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink/40" onClick={onClose} aria-hidden="true" />}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby="course-drawer-title"
        className={`fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[82vh] rounded-t-2xl
          sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:h-full sm:w-full sm:max-w-sm sm:rounded-none sm:border-l sm:border-line
          ${open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"}`}
      >
        {entry && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs text-ink/40">{entry.courseCode}</p>
                <h3 id="course-drawer-title" className="mt-0.5 font-display text-lg leading-snug text-ink">
                  {lang === "ko" ? entry.nameKr : entry.nameEn ?? entry.nameKr}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label={t.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-surface-muted hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                <div>
                  <dt className="text-ink/40">{t.type}</dt>
                  <dd className="mt-0.5 text-ink/80">{meta ? (lang === "ko" ? meta.labelKr : meta.labelEn) : entry.courseType}</dd>
                </div>
                <div>
                  <dt className="text-ink/40">{t.credit}</dt>
                  <dd className="mt-0.5 text-ink/80">{entry.credit}</dd>
                </div>
                <div>
                  <dt className="text-ink/40">{t.yearSemester}</dt>
                  <dd className="mt-0.5 text-ink/80">
                    {yearLabelFromBucket(entry.bucket, lang)} · {semesterLabelFromBucket(entry.bucket, lang)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink/40">{t.hours}</dt>
                  <dd className="mt-0.5 text-ink/80">
                    {entry.lectureHours} / {entry.practiceHours}
                  </dd>
                </div>
                {entry.nameEn && (
                  <div className="col-span-2">
                    <dt className="text-ink/40">{t.nameEn}</dt>
                    <dd className="mt-0.5 text-ink/80">{entry.nameEn}</dd>
                  </div>
                )}
                {row && (
                  <div className="col-span-2">
                    <dt className="text-ink/40">{t.field}</dt>
                    <dd className="mt-0.5 flex items-center gap-1.5 text-ink/80">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                      {rowLabel(row, lang)}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 space-y-3 border-t border-line pt-5">
                {detail?.hasDetail && detail.description && (
                  <p className="text-sm leading-relaxed text-ink/75">{detail.description}</p>
                )}
                {detail?.keywords && (
                  <p className="text-xs text-ink/50">
                    <span className="text-ink/40">{t.keywords}:</span> {detail.keywords}
                  </p>
                )}
                {entry.dataNote && <p className="text-xs italic text-ink/40">※ {entry.dataNote}</p>}
              </div>

              {relatedEntries.length > 0 && (
                <div className="mt-5 border-t border-line pt-5">
                  <p className="text-xs text-ink/40">{t.related}</p>
                  <ul className="mt-2 space-y-1.5">
                    {relatedEntries.map((r) => (
                      <li key={r.courseId}>
                        <button
                          onClick={() => onSelectCode(r.courseCode)}
                          className="text-sm text-primary hover:underline"
                        >
                          {lang === "ko" ? r.nameKr : r.nameEn ?? r.nameKr}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
