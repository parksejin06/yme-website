import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import ScrollReveal from "@/components/ScrollReveal";
import { ABOUT_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Overview" };

const QUICK_LINKS = [
  { path: "/about/history", title: "History", desc: "The department's path since 1958." },
  { path: "/about/staff", title: "Staff", desc: "Find administrative contacts for undergraduate, graduate, and research affairs." },
  { path: "/about/directions", title: "Directions", desc: "Campus location and how to get here." },
];

export default function AboutPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="Overview"
        image="/images/eagle-statue.jpg"
        imageAlt="Yonsei University's eagle statue and 'YONSEI, where we make history' signage"
        imagePosition="center 30%"
      />
      <SectionSubNav items={ABOUT_NAV} lang="en" label="About sub-navigation" />

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">OVERVIEW</p>
          <blockquote className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-4xl">
            &ldquo;Relentless challenge, creating value for the world.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-2xl text-ink/70">
            Since its founding in 1962, Yonsei University&apos;s School of Mechanical Engineering has led mechanical
            engineering education and research in Korea for over 60 years. Numerous labs are active across a wide
            range of research fields — precision design, thermofluids, robotics/mechatronics, materials/structures,
            nano/bio, and energy — cultivating talent who contribute to industry.
          </p>

          <div className="mt-14 border-t border-line pt-14">
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">EDUCATIONAL OBJECTIVE</p>
            <p className="mt-3 max-w-2xl text-balance font-display text-xl text-ink sm:text-2xl">
              Cultivating talent with creative thinking and comprehensive design capability who create value
              beneficial to a global society.
            </p>
            <p className="mt-5 text-sm text-ink/60">
              See the undergraduate program&apos;s 5 detailed learning objectives on the Undergraduate page.
            </p>
            <Link
              href="/en/undergraduate/goals"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View Undergraduate Education Goals <ChevronRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">Explore About</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
