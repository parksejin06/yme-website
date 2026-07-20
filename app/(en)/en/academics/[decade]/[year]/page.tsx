import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GraduationSummary from "@/components/academics/GraduationSummary";
import SpecialNotes from "@/components/academics/SpecialNotes";
import CourseExplorer, { type CourseDetail } from "@/components/academics/CourseExplorer";
import DualMajorInfo from "@/components/academics/DualMajorInfo";
import { ArrowLeftIcon } from "@/components/icons";
import gradRequirements from "@/data/graduation-requirements.json";
import curriculum from "@/data/curriculum.json";
import courses from "@/data/courses.json";
import dualMajor from "@/data/dual-major.json";
import { STUDENT_GROUPS } from "@/lib/academics";

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
  return { title: entry ? `${entry.label} Graduation Requirements` : "Academics" };
}

export default async function AcademicsYearPageEn({
  params,
}: {
  params: Promise<{ decade: string; year: string }>;
}) {
  const { decade, year } = await params;
  const entry = (gradRequirements as GradEntry[]).find((g) => g.decade === decade && g.slug === year);
  if (!entry) notFound();

  const groupMeta = STUDENT_GROUPS.find((g) => g.slug === entry.slug);
  const courseMap = new Map<string, CourseDetail>((courses as CourseDetail[]).map((c) => [c.courseCode, c]));

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <Link href="/en/academics" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon /> Back to Academics
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

        <div>
          <h2 className="font-display text-xl text-ink">Curriculum by Year &amp; Semester</h2>
          <p className="mt-2 text-sm text-ink/60">
            This curriculum plan is common to all cohorts; please cross-reference it with the requirements above.
          </p>
          <div className="mt-5">
            <CourseExplorer entries={curriculum} courseMap={courseMap} lang="en" />
          </div>
        </div>

        <DualMajorInfo rows={dualMajor} lang="en" />
      </section>
    </>
  );
}
