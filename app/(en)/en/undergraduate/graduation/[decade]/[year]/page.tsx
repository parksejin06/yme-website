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
import { STUDENT_GROUPS } from "@/lib/academics";
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
  return { title: entry ? `${entry.label} Graduation Requirements` : "Graduation Requirements" };
}

export default async function UndergraduateGraduationYearPageEn({
  params,
}: {
  params: Promise<{ decade: string; year: string }>;
}) {
  const { decade, year } = await params;
  const entry = (gradRequirements as GradEntry[]).find((g) => g.decade === decade && g.slug === year);
  if (!entry) notFound();

  const groupMeta = STUDENT_GROUPS.find((g) => g.slug === entry.slug);

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <Link href="/en/undergraduate/graduation" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon /> Back to Graduation Requirements
          </Link>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            {groupMeta?.labelEn ?? entry.label} Graduation Requirements
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Requirement details are sourced directly from the department&apos;s official records and are shown in
            Korean where no official English translation exists, to avoid mistranslating graduation policy.
          </p>
        </div>
      </section>
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb
        lang="en"
        items={[
          { label: "Undergraduate", path: "/undergraduate" },
          { label: "Graduation Requirements", path: "/undergraduate/graduation" },
          { label: `${groupMeta?.labelEn ?? entry.label} Requirements` },
        ]}
      />

      <section className="mx-auto max-w-content space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        <div>
          <h2 className="font-display text-xl text-ink">Requirement Summary</h2>
          <div className="mt-5">
            <GraduationSummary summary={entry.summary} lang="en" />
          </div>
        </div>

        {entry.mandatoryCourses.length > 0 && (
          <div>
            <h2 className="font-display text-xl text-ink">Required Major Courses</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.mandatoryCourses.map((c) => (
                <span key={c} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-primary">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <SpecialNotes notes={entry.specialNotes} lang="en" />

        <Link
          href="/en/undergraduate/courses"
          className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface-muted/60 p-5 transition-colors hover:border-primary-soft"
        >
          <div>
            <p className="font-display text-base text-ink">View Courses by Year &amp; Semester</p>
            <p className="mt-1 text-sm text-ink/60">Cross-reference these requirements with the full course list by year and semester.</p>
          </div>
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>

        <DualMajorInfo rows={dualMajor} lang="en" />
      </section>
    </>
  );
}
