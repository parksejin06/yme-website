import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GraduationSummary from "@/components/academics/GraduationSummary";
import SpecialNotes from "@/components/academics/SpecialNotes";
import DualMajorInfo from "@/components/academics/DualMajorInfo";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import gradRequirements from "@/data/graduation-requirements.json";
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
  return { title: entry ? `${entry.label} 졸업요건` : "졸업 요건" };
}

export default async function UndergraduateGraduationYearPage({
  params,
}: {
  params: Promise<{ decade: string; year: string }>;
}) {
  const { decade, year } = await params;
  const entry = (gradRequirements as GradEntry[]).find((g) => g.decade === decade && g.slug === year);
  if (!entry) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <Link href="/undergraduate/graduation" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon /> 졸업 요건으로
          </Link>
          <h1 className="mt-4 font-display text-white" style={{ fontSize: "clamp(1.75rem, 3vw, 3rem)" }}>
            {entry.label} 졸업요건
          </h1>
          {entry.note && <p className="mt-3 max-w-2xl text-lg text-white/70">{entry.note}</p>}
        </div>
      </section>
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb
        lang="ko"
        items={[
          { label: "학부", path: "/undergraduate" },
          { label: "졸업 요건", path: "/undergraduate/graduation" },
          { label: `${entry.label} 졸업요건` },
        ]}
      />

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

        <Link
          href="/undergraduate/courses"
          className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface-muted/60 p-5 transition-colors hover:border-primary-soft"
        >
          <div>
            <p className="font-display text-base text-ink">학년·학기별 교과목 소개 보기</p>
            <p className="mt-1 text-sm text-ink/60">위 졸업요건과 함께, 학년·학기별로 개설되는 전체 교과목을 확인하세요.</p>
          </div>
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>

        <DualMajorInfo rows={dualMajor} lang="ko" />
      </section>
    </>
  );
}
