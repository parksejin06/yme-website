import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { GRADUATE_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";
import gradRequirements from "@/data/graduate-graduation-requirements.json";

export const metadata: Metadata = { title: "Graduate Overview" };

const QUICK_LINKS = [
  { path: "/graduate/graduation", title: "Graduation Requirements", desc: "Minimum credits and degree procedures for the Master's, Doctoral, and Combined programs." },
  { path: "/graduate/courses", title: "Courses", desc: "Search and browse over 180 graduate courses by research area." },
  { path: "/graduate/curriculum-map", title: "Academic & Research Map", desc: "Explore related courses and faculty by research area of interest." },
];

export default function GraduatePageEn() {
  return (
    <>
      <PageHero
        eyebrow="GRADUATE"
        title="Graduate Overview"
        description="The graduate program at Yonsei Mechanical Engineering trains specialized researchers and industry leaders through research-focused advanced education."
        image="/images/robotics-lab.jpg"
        imageAlt="Graduate students conducting a lab experiment"
      />
      <SectionSubNav items={GRADUATE_NAV} lang="en" label="Graduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Graduate" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">GRADUATE PROGRAM</p>
        <p className="mt-4 max-w-2xl text-ink/70">
          After admission, graduate students are assigned an advisor and combine major coursework with lab research,
          then complete a comprehensive exam and a thesis preliminary and final review to earn their degree.
          Program-specific requirements are on the Graduation Requirements page, offered courses on the Courses
          page, and research-interest-based connections to courses and faculty on the Academic &amp; Research Map
          page.
        </p>

        <div className="mt-10 rounded-lg border border-line bg-surface-muted/60 p-5">
          <p className="text-xs text-ink/45">
            For detailed graduate admissions information, see the Yonsei University Graduate School website.
          </p>
          <a
            href="https://graduate.yonsei.ac.kr/graduate/index.do"
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline"
          >
            Graduate School Admissions ↗
          </a>
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">Explore the Graduate Program</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.path}
                href={`/en${q.path}`}
                className="group flex items-start justify-between gap-3 rounded-lg border border-line bg-white p-5 transition-colors hover:border-primary-soft"
              >
                <div>
                  <p className="font-display text-base text-ink">{q.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{q.desc}</p>
                </div>
                <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {gradRequirements.programs.map((p) => (
              <div key={p.key} className="rounded-lg border border-line bg-white p-4">
                <p className="text-xs text-ink/45">{p.labelEn}</p>
                <p className="mt-1 font-display text-xl text-ink">Min. {p.credits} credits</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
