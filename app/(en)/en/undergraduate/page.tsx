import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Undergraduate Overview" };

const QUICK_LINKS = [
  { path: "/undergraduate/goals", title: "Education Goals", desc: "See the profile of graduates we aim to cultivate and our detailed education goals." },
  { path: "/undergraduate/graduation", title: "Graduation Requirements", desc: "Select your cohort year to view the requirements that apply to you." },
  { path: "/undergraduate/courses", title: "Courses", desc: "Browse major and liberal-arts courses offered by year and semester." },
  { path: "/undergraduate/curriculum-map", title: "Curriculum Map", desc: "See how courses connect from year 1 through year 4 at a glance." },
];

export default function UndergraduatePageEn() {
  return (
    <>
      <PageHero
        eyebrow="UNDERGRADUATE"
        title="Undergraduate Overview"
        description="The undergraduate program at Yonsei Mechanical Engineering cultivates creative thinkers with strong systems-design capability."
        image="/images/new_mainbg/학부_배경사진.jpg"
        imageAlt="Underwood Hall at Yonsei University"
      />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">MISSION</p>
        <blockquote className="mt-4 max-w-3xl text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;Cultivating talent with creative thinking and comprehensive design capability who create value for a
          global society.&rdquo;
        </blockquote>
        <p className="mt-5 max-w-2xl text-ink/70">
          The undergraduate curriculum begins with foundational science and mathematics in year 1, moves into major
          core courses — solid mechanics, thermodynamics, fluid mechanics, and dynamics — from year 2, and builds
          toward applied electives and capstone design/research courses in years 3 and 4. Explore education goals,
          graduation requirements, courses, and the curriculum map below.
        </p>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">Explore the Undergraduate Program</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.path}
                href={`/en${q.path}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-white p-5 transition-colors hover:border-primary-soft"
              >
                <div>
                  <p className="font-display text-base text-ink">{q.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{q.desc}</p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
