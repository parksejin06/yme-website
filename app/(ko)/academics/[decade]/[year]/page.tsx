import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GraduationSummary from "@/components/academics/GraduationSummary";
import SpecialNotes from "@/components/academics/SpecialNotes";
import CurriculumAccordion, { type CourseDetail } from "@/components/academics/CurriculumAccordion";
import DualMajorInfo from "@/components/academics/DualMajorInfo";
import { ArrowLeftIcon } from "@/components/icons";
import gradRequirements from "@/data/graduation-requirements.json";
import curriculum from "@/data/curriculum.json";
import courses from "@/data/courses.json";
import dualMajor from "@/data/dual-major.json";

type GradEntry = (typeof gradRequirements)[number];

export function generateStaticParams() {
  return (gradRequirements as GradEntry[]).map((g) => ({ decade: g.decade, year: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ decade: string; year: string }>;
}): Promise<Metadata> {
  const { decade, year } = await params;
  const entry = (gradRequirements as GradEntry[]).find((g) => g.decade === decade && g.slug === year);
  return { title: entry ? `${entry.label} 졸업요건` : "학부 교육과정" };
}

export default async function AcademicsYearPage({
  params,
}: {
  params: Promise<{ decade: string; year: string }>;
}) {
  const { decade, year } = await params;
  const entry = (gradRequirements as GradEntry[]).find((g) => g.decade === decade && g.slug === year);
  if (!entry) notFound();

  const courseMap = new Map<string, CourseDetail>((courses as CourseDetail[]).map((c) => [c.courseCode, c]));

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <Link href="/academics" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon /> 학부 교육과정으로
          </Link>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl">{entry.label} 졸업요건</h1>
          {entry.note && <p className="mt-2 max-w-2xl text-white/70">{entry.note}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-content space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        <div>
          <h2 className="font-display text-xl text-ink">졸업요건 요약</h2>
          <div className="mt-5">
            <GraduationSummary summary={entry.summary} lang="ko" />
          </div>
        </div>

        {entry.mandatoryCourses.length > 0 && (
          <div>
            <h2 className="font-display text-xl text-ink">전공필수 교과목</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.mandatoryCourses.map((c) => (
                <span key={c} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-primary">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <SpecialNotes notes={entry.specialNotes} lang="ko" />

        <div>
          <h2 className="font-display text-xl text-ink">학년학기별 교육과정</h2>
          <p className="mt-2 text-sm text-ink/60">
            아래 편성표는 전체 학번 공통 자료이며, 위 졸업요건과 함께 참고하시기 바랍니다.
          </p>
          <div className="mt-5">
            <CurriculumAccordion entries={curriculum} courseMap={courseMap} lang="ko" />
          </div>
        </div>

        <DualMajorInfo rows={dualMajor} lang="ko" />
      </section>
    </>
  );
}
