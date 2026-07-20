"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RESEARCH_AREAS,
  RESEARCH_AREA_TO_FACULTY_FIELD,
  researchAreaLabel,
  type GraduateCourse,
} from "@/lib/graduate";
import { fieldLabel, type FacultyMember } from "@/lib/faculty";
import { localizePath, type Lang } from "@/lib/nav";

interface RoadmapStep {
  key: string;
  labelKr: string;
  labelEn: string;
}

const COPY = {
  ko: {
    roadmapTitle: "학위 취득 절차 개요",
    roadmapMore: "자세한 졸업요건 보기",
    exploreTitle: "연구분야로 탐색하기",
    exploreHint: "관심 있는 연구분야를 선택하면 관련 대학원 교과목과 교수진을 함께 확인할 수 있습니다.",
    disclaimer: "※ 연구분야 매칭은 과목명·교수 전공 분류를 기준으로 한 참고용 연결이며, 지도교수 배정을 의미하지 않습니다.",
    courses: "관련 대학원 교과목",
    faculty: "관련 교수진",
    noCourses: "이 분야로 분류된 교과목이 없습니다.",
    noFaculty: "이 분야로 분류된 교수진이 없습니다.",
    viewAllCourses: "대학원 교과목 전체 보기",
    viewFacultyProfile: "교수 프로필 보기",
  },
  en: {
    roadmapTitle: "Degree Roadmap Overview",
    roadmapMore: "View full graduation requirements",
    exploreTitle: "Explore by Research Area",
    exploreHint: "Select a research area to see related graduate courses and faculty together.",
    disclaimer: "※ Research-area matches are a reference grouping based on course names and faculty specialization, not an advisor assignment.",
    courses: "Related Graduate Courses",
    faculty: "Related Faculty",
    noCourses: "No courses are classified under this area.",
    noFaculty: "No faculty are classified under this area.",
    viewAllCourses: "View all graduate courses",
    viewFacultyProfile: "View profile",
  },
};

export default function AcademicResearchMap({
  roadmap,
  courses,
  faculty,
  lang,
}: {
  roadmap: RoadmapStep[];
  courses: GraduateCourse[];
  faculty: FacultyMember[];
  lang: Lang;
}) {
  const t = COPY[lang];
  const [area, setArea] = useState(RESEARCH_AREAS[0].key);

  const matchedCourses = courses.filter((c) => c.researchArea === area);
  const targetField = RESEARCH_AREA_TO_FACULTY_FIELD[area];
  const matchedFaculty = faculty.filter((f) => f.field === targetField);

  return (
    <div className="space-y-14">
      {/* Compact roadmap */}
      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg text-ink">{t.roadmapTitle}</h2>
          <Link href={localizePath("/graduate/graduation", lang)} className="shrink-0 text-xs font-medium text-primary hover:underline">
            {t.roadmapMore} →
          </Link>
        </div>
        <ol className="mt-6 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
          {roadmap.map((step, i) => (
            <li key={step.key} className="flex items-center sm:contents">
              <div className="flex items-center gap-3 py-1.5 sm:flex-col sm:items-center sm:py-0 sm:text-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft/20 text-[11px] font-display text-primary-strong">
                  {i + 1}
                </span>
                <span className="text-xs text-ink/70 sm:mt-1.5 sm:w-20">{lang === "ko" ? step.labelKr : step.labelEn}</span>
              </div>
              {i < roadmap.length - 1 && (
                <>
                  <span className="ml-3.5 h-4 w-px bg-line sm:hidden" aria-hidden="true" />
                  <span className="hidden h-px flex-1 bg-line sm:mx-1.5 sm:block" aria-hidden="true" />
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Research-area explorer */}
      <section>
        <h2 className="font-display text-lg text-ink">{t.exploreTitle}</h2>
        <p className="mt-1.5 text-sm text-ink/50">{t.exploreHint}</p>
        <p className="mt-1 text-xs text-ink/35">{t.disclaimer}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {RESEARCH_AREAS.map((a) => (
            <button
              key={a.key}
              onClick={() => setArea(a.key)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                area === a.key ? "border-primary bg-primary text-white" : "border-line text-ink/65 hover:border-primary-soft hover:text-primary"
              }`}
            >
              {lang === "ko" ? a.labelKr : a.labelEn}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-sm text-ink/70">
              {t.courses} ({researchAreaLabel(area, lang)})
            </h3>
            {matchedCourses.length === 0 ? (
              <p className="mt-3 text-sm text-ink/40">{t.noCourses}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {matchedCourses.map((c) => (
                  <li key={c.courseCode} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
                    <span className="text-ink/80">{lang === "ko" ? c.nameKr : c.nameEn ?? c.nameKr}</span>
                    <span className="shrink-0 text-xs text-ink/40">{c.courseCode}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={localizePath("/graduate/courses", lang)} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
              {t.viewAllCourses} →
            </Link>
          </div>

          <div>
            <h3 className="font-display text-sm text-ink/70">
              {t.faculty} ({fieldLabel(targetField, lang)})
            </h3>
            {matchedFaculty.length === 0 ? (
              <p className="mt-3 text-sm text-ink/40">{t.noFaculty}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {matchedFaculty.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={localizePath(`/faculty/${f.slug}`, lang)}
                      className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:border-primary-soft"
                    >
                      {f.photoPath ? (
                        <Image src={f.photoPath} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs text-ink/30">
                          {f.name.slice(0, 1)}
                        </span>
                      )}
                      <span>
                        <span className="block font-display text-sm text-ink">{f.name}</span>
                        <span className="block text-xs text-ink/50">{f.labName ?? t.viewFacultyProfile}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
