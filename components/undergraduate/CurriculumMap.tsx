"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  YEAR_GROUPS,
  SEMESTERS,
  courseTypeMeta,
  yearLabelFromBucket,
  semesterLabelFromBucket,
  type Lang,
} from "@/lib/academics";
import type { CurriculumEntry, CourseDetail } from "@/components/academics/CourseExplorer";

const COPY = {
  ko: {
    original: "공식 교과목 체계도 원본",
    originalHint: "클릭하면 확대해서 볼 수 있습니다",
    interactive: "인터랙티브 체계도",
    interactiveHint: "과목을 클릭하면 상세 정보를 확인할 수 있습니다",
    required: "필수",
    elective: "선택",
    year: "학년 선택",
    semester: "학기 선택",
    credit: "학점",
    yearSemester: "학년·학기",
    keywords: "핵심 키워드",
    related: "관련 교과목",
    researchArea: "관련 연구분야",
  },
  en: {
    original: "Official Curriculum Diagram",
    originalHint: "Click to zoom in",
    interactive: "Interactive Curriculum Map",
    interactiveHint: "Click a course to see its details",
    required: "Required",
    elective: "Elective",
    year: "Select year",
    semester: "Select semester",
    credit: " credits",
    yearSemester: "Year / Semester",
    keywords: "Keywords",
    related: "Related Courses",
    researchArea: "Related Research Area",
  },
};

const CATEGORY_ORDER = ["기초", "전공핵심", "응용·심화", "실험·설계"];
const CATEGORY_LABEL: Record<string, { ko: string; en: string }> = {
  "기초": { ko: "기초(MSC)", en: "Basic Science (MSC)" },
  "전공핵심": { ko: "전공핵심", en: "Major Core" },
  "응용·심화": { ko: "응용·심화", en: "Applied/Advanced" },
  "실험·설계": { ko: "실험·설계", en: "Lab/Design" },
};

const BUCKET_COLUMNS = [
  { key: "1-1", groupWith: null },
  { key: "1-2", groupWith: null },
  { key: "2-1", groupWith: null },
  { key: "2-2", groupWith: null },
  { key: "34-1", groupWith: "3-4" },
  { key: "34-2", groupWith: "3-4" },
  { key: "4-1", groupWith: null },
  { key: "4-2", groupWith: null },
];

function CourseChip({
  entry,
  lang,
  onSelect,
}: {
  entry: CurriculumEntry;
  lang: Lang;
  onSelect: (e: CurriculumEntry) => void;
}) {
  const required = entry.courseType === "전필";
  return (
    <button
      onClick={() => onSelect(entry)}
      className={`block w-full rounded px-2.5 py-1.5 text-left text-xs leading-snug transition-colors ${
        required
          ? "bg-primary text-white hover:bg-primary-strong"
          : "border border-line bg-white text-ink/75 hover:border-primary-soft hover:text-primary"
      }`}
    >
      {lang === "ko" ? entry.nameKr : entry.nameEn ?? entry.nameKr}
    </button>
  );
}

function Column({
  bucketKey,
  entries,
  lang,
  onSelect,
}: {
  bucketKey: string;
  entries: CurriculumEntry[];
  lang: Lang;
  onSelect: (e: CurriculumEntry) => void;
}) {
  const inBucket = entries.filter((e) => e.bucket === bucketKey).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-56 sm:shrink-0">
      <p className="rounded bg-primary-strong px-2 py-1.5 text-center text-xs font-display text-white">
        {yearLabelFromBucket(bucketKey, lang)} · {semesterLabelFromBucket(bucketKey, lang)}
      </p>
      {CATEGORY_ORDER.map((cat) => {
        const inCat = inBucket.filter((e) => e.category === cat);
        if (inCat.length === 0) return null;
        return (
          <div key={cat}>
            <p className="mb-1.5 text-[11px] font-medium text-ink/40">{CATEGORY_LABEL[cat]?.[lang] ?? cat}</p>
            <div className="space-y-1">
              {inCat.map((e) => (
                <CourseChip key={e.courseId} entry={e} lang={lang} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected, setSelected] = useState<CurriculumEntry | null>(null);
  const [mobileYear, setMobileYear] = useState(YEAR_GROUPS[0].key);
  const [mobileSemester, setMobileSemester] = useState(SEMESTERS[0].key);

  const selectedDetail = selected ? courseMap.get(selected.courseCode) : null;
  const selectedMeta = selected ? courseTypeMeta(selected.courseType) : null;

  return (
    <div className="space-y-14">
      {/* A. Original diagram */}
      <section>
        <h2 className="font-display text-lg text-ink">{t.original}</h2>
        <button
          onClick={() => setLightboxOpen(true)}
          className="group relative mt-4 block w-full max-w-sm overflow-hidden rounded-lg border border-line"
        >
          <Image
            src="/images/undergraduate-curriculum-diagram.jpg"
            alt={lang === "ko" ? "기계공학부 교과목 체계도 원본 이미지" : "Official Mechanical Engineering curriculum tree diagram"}
            width={793}
            height={1121}
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/30 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-ink">
              <ZoomIn className="h-3.5 w-3.5" /> {t.originalHint}
            </span>
          </div>
        </button>
      </section>

      {/* B. Interactive map */}
      <section>
        <h2 className="font-display text-lg text-ink">{t.interactive}</h2>
        <p className="mt-1.5 text-sm text-ink/50">{t.interactiveHint}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink/60">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary" /> {t.required}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-line bg-white" /> {t.elective}
          </span>
        </div>

        {/* Mobile: year/semester navigator, one column at a time */}
        <div className="mt-5 sm:hidden">
          <div className="flex gap-1 overflow-x-auto">
            {YEAR_GROUPS.map((g) => (
              <button
                key={g.key}
                onClick={() => setMobileYear(g.key)}
                className={`shrink-0 rounded-md px-3.5 py-2.5 text-sm font-display ${
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
          <div className="mt-5">
            <Column bucketKey={`${mobileYear}-${mobileSemester}`} entries={entries} lang={lang} onSelect={setSelected} />
          </div>
        </div>

        {/* Desktop/tablet: full tree, horizontal scroll if needed */}
        <div className="mt-5 hidden overflow-x-auto pb-4 sm:block">
          <div className="flex min-w-max gap-4">
            {BUCKET_COLUMNS.map((col, i) => {
              const prevGrouped = BUCKET_COLUMNS[i - 1]?.groupWith === col.groupWith && col.groupWith !== null;
              return (
                <div key={col.key} className={prevGrouped ? "-ml-2 border-l border-dashed border-line pl-2" : undefined}>
                  <Column bucketKey={col.key} entries={entries} lang={lang} onSelect={setSelected} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox for the original diagram */}
      <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} panelClassName="max-w-3xl">
        <Image
          src="/images/undergraduate-curriculum-diagram.jpg"
          alt=""
          width={793}
          height={1121}
          className="w-full"
        />
      </Modal>

      {/* Course detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="curriculum-map-course-title" panelClassName="max-w-md">
        {selected && (
          <div className="p-6">
            <h3 id="curriculum-map-course-title" className="pr-8 font-display text-lg text-ink">
              {lang === "ko" ? selected.nameKr : selected.nameEn ?? selected.nameKr}
            </h3>
            {selected.nameEn && lang === "ko" && <p className="mt-0.5 text-sm text-ink/50">{selected.nameEn}</p>}

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
              <div>
                <dt className="text-ink/40">{lang === "ko" ? "학정번호" : "Course Code"}</dt>
                <dd className="mt-0.5 text-ink/80">{selected.courseCode}</dd>
              </div>
              <div>
                <dt className="text-ink/40">{lang === "ko" ? "이수구분" : "Category"}</dt>
                <dd className="mt-0.5 text-ink/80">
                  {selectedMeta ? (lang === "ko" ? selectedMeta.labelKr : selectedMeta.labelEn) : selected.courseType}
                </dd>
              </div>
              <div>
                <dt className="text-ink/40">{t.credit}</dt>
                <dd className="mt-0.5 text-ink/80">{selected.credit}</dd>
              </div>
              <div>
                <dt className="text-ink/40">{t.yearSemester}</dt>
                <dd className="mt-0.5 text-ink/80">
                  {yearLabelFromBucket(selected.bucket, lang)} · {semesterLabelFromBucket(selected.bucket, lang)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2.5 border-t border-line pt-4">
              {selectedDetail?.hasDetail && selectedDetail.description && (
                <p className="text-sm leading-relaxed text-ink/75">{selectedDetail.description}</p>
              )}
              {selectedDetail?.keywords && (
                <p className="text-xs text-ink/50">
                  <span className="text-ink/40">{t.keywords}:</span> {selectedDetail.keywords}
                </p>
              )}
              {selected.researchArea && (
                <p className="text-xs text-ink/50">
                  <span className="text-ink/40">{t.researchArea}:</span> {selected.researchArea}
                </p>
              )}
              {selectedDetail?.relatedCourses && (
                <p className="text-xs text-ink/50">
                  <span className="text-ink/40">{t.related}:</span> {selectedDetail.relatedCourses}
                </p>
              )}
              {selected.dataNote && <p className="text-xs italic text-ink/40">※ {selected.dataNote}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
