"use client";

import { useState } from "react";
import type { Lang } from "@/lib/nav";

interface ProgramCredit {
  key: string;
  labelKr: string;
  labelEn: string;
  credits: number;
  creditsBefore2026: number;
}

interface RoadmapStep {
  key: string;
  labelKr: string;
  labelEn: string;
}

interface Section {
  key: string;
  titleKr: string;
  titleEn: string;
  paragraphsKr: string[];
  paragraphsEn: string[];
}

interface RequiredCourse {
  code: string;
  nameKr: string;
  nameEn: string;
  credit: number;
  offeredBy: string;
  noteKr: string;
  noteEn: string;
}

interface ExamSection {
  titleKr: string;
  titleEn: string;
  paragraphsKr: string[];
  paragraphsEn: string[];
}

interface EnglishTableRow {
  groupKr: string;
  groupEn: string;
  TOEFL_PBT: number;
  TOEFL_CBT: number;
  TOEFL_iBT: number;
  TOEIC: number;
  TEPS: string;
  IELTS: number;
}

export interface GraduateRequirementsData {
  programs: ProgramCredit[];
  roadmap: RoadmapStep[];
  sections: Section[];
  requiredCourses: RequiredCourse[];
  comprehensiveExam: ExamSection;
  thesisPreliminaryReview: ExamSection;
  thesisFinalReview: ExamSection;
  englishRequirement: {
    titleKr: string;
    titleEn: string;
    introKr: string;
    introEn: string;
    table: EnglishTableRow[];
    notesKr: string[];
    notesEn: string[];
  };
  publicationRequirement: ExamSection;
  misc: ExamSection;
}

const COPY = {
  ko: {
    comparison: "과정별 최소 졸업학점 비교",
    creditsFrom2026: "26년 이후 입학",
    creditsBefore2026: "26년 이전 입학",
    roadmap: "학위 취득 절차",
    requiredCourses: "필수 교과목",
    credit: "학점",
  },
  en: {
    comparison: "Minimum Graduation Credits by Program",
    creditsFrom2026: "Admitted 2026 or later",
    creditsBefore2026: "Admitted before 2026",
    roadmap: "Degree Roadmap",
    requiredCourses: "Required Courses",
    credit: " credits",
  },
};

export default function GraduationRequirements({ data, lang }: { data: GraduateRequirementsData; lang: Lang }) {
  const t = COPY[lang];
  const [program, setProgram] = useState(data.programs[0].key);
  const selected = data.programs.find((p) => p.key === program)!;

  return (
    <div className="space-y-16">
      {/* Program tabs */}
      <div role="tablist" aria-label={lang === "ko" ? "과정 선택" : "Select program"} className="flex gap-1">
        {data.programs.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={program === p.key}
            onClick={() => setProgram(p.key)}
            className={`min-h-11 rounded-md px-5 text-sm font-display transition-colors ${
              program === p.key ? "bg-primary text-white" : "border border-line text-ink/70 hover:border-primary-soft"
            }`}
          >
            {lang === "ko" ? p.labelKr : p.labelEn}
          </button>
        ))}
      </div>

      {/* Min-credit comparison */}
      <section>
        <h2 className="font-display text-lg text-ink">{t.comparison}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {data.programs.map((p) => (
            <div
              key={p.key}
              className={`rounded-lg border p-5 transition-colors ${
                p.key === program ? "border-primary bg-primary/5" : "border-line"
              }`}
            >
              <p className="font-display text-sm text-ink">{lang === "ko" ? p.labelKr : p.labelEn}</p>
              <p className="mt-3 font-display text-3xl text-primary">
                {p.credits}
                <span className="ml-1 text-base text-ink/50">{t.credit}</span>
              </p>
              <p className="mt-1 text-xs text-ink/45">{t.creditsFrom2026}</p>
              <p className="mt-3 text-xs text-ink/60">
                {t.creditsBefore2026}: {p.creditsBefore2026}
                {t.credit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="font-display text-lg text-ink">
          {t.roadmap} — {lang === "ko" ? selected.labelKr : selected.labelEn}
        </h2>
        <ol className="mt-6 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
          {data.roadmap.map((step, i) => (
            <li key={step.key} className="flex items-center sm:contents">
              <div className="flex items-center gap-3 py-2 sm:flex-col sm:items-center sm:py-0 sm:text-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-display text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-ink/80 sm:mt-2 sm:w-24 sm:text-xs">
                  {lang === "ko" ? step.labelKr : step.labelEn}
                </span>
              </div>
              {i < data.roadmap.length - 1 && (
                <>
                  <span className="ml-4 h-6 w-px bg-line sm:hidden" aria-hidden="true" />
                  <span className="hidden h-px flex-1 bg-line sm:mx-2 sm:block" aria-hidden="true" />
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Prose sections: advisor assignment, coursework */}
      {data.sections.map((s) => (
        <section key={s.key}>
          <h2 className="font-display text-lg text-ink">{lang === "ko" ? s.titleKr : s.titleEn}</h2>
          <div className="mt-4 space-y-3">
            {(lang === "ko" ? s.paragraphsKr : s.paragraphsEn).map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* Required courses table */}
      <section>
        <h2 className="font-display text-lg text-ink">{t.requiredCourses}</h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {data.requiredCourses.map((c) => (
            <div key={c.code} className="py-3.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-display text-sm text-ink">{lang === "ko" ? c.nameKr : c.nameEn}</span>
                <span className="text-xs text-ink/45">{c.code}</span>
                <span className="text-xs text-ink/45">
                  {c.credit}
                  {t.credit}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/55">{lang === "ko" ? c.noteKr : c.noteEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exam / review sections */}
      {[data.comprehensiveExam, data.thesisPreliminaryReview, data.thesisFinalReview].map((sec) => (
        <section key={sec.titleKr}>
          <h2 className="font-display text-lg text-ink">{lang === "ko" ? sec.titleKr : sec.titleEn}</h2>
          <ul className="mt-4 space-y-2.5">
            {(lang === "ko" ? sec.paragraphsKr : sec.paragraphsEn).map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* English requirement table */}
      <section>
        <h2 className="font-display text-lg text-ink">
          {lang === "ko" ? data.englishRequirement.titleKr : data.englishRequirement.titleEn}
        </h2>
        <p className="mt-3 text-sm text-ink/70">
          {lang === "ko" ? data.englishRequirement.introKr : data.englishRequirement.introEn}
        </p>
        <div className="mt-5 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-muted text-left">
                <th className="px-4 py-3 font-display font-normal text-ink/70">{lang === "ko" ? "구분" : "Program"}</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">TOEFL(PBT)</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">TOEFL(CBT)</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">TOEFL(iBT)</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">TOEIC</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">TEPS</th>
                <th className="px-4 py-3 font-display font-normal text-ink/70">IELTS</th>
              </tr>
            </thead>
            <tbody>
              {data.englishRequirement.table.map((row) => (
                <tr key={row.groupKr} className="border-t border-line">
                  <td className="px-4 py-3 text-ink/80">{lang === "ko" ? row.groupKr : row.groupEn}</td>
                  <td className="px-4 py-3 text-ink/70">{row.TOEFL_PBT}</td>
                  <td className="px-4 py-3 text-ink/70">{row.TOEFL_CBT}</td>
                  <td className="px-4 py-3 text-ink/70">{row.TOEFL_iBT}</td>
                  <td className="px-4 py-3 text-ink/70">{row.TOEIC}</td>
                  <td className="px-4 py-3 text-ink/70">{row.TEPS}</td>
                  <td className="px-4 py-3 text-ink/70">{row.IELTS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1.5">
          {(lang === "ko" ? data.englishRequirement.notesKr : data.englishRequirement.notesEn).map((n, i) => (
            <p key={i} className="text-xs text-ink/50">
              {n}
            </p>
          ))}
        </div>
      </section>

      {/* Publication requirement + misc */}
      {[data.publicationRequirement, data.misc].map((sec) => (
        <section key={sec.titleKr}>
          <h2 className="font-display text-lg text-ink">{lang === "ko" ? sec.titleKr : sec.titleEn}</h2>
          <ul className="mt-4 space-y-2.5">
            {(lang === "ko" ? sec.paragraphsKr : sec.paragraphsEn).map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
