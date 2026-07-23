import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ParallaxImage from "@/components/ParallaxImage";
import ScrollReveal from "@/components/ScrollReveal";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AlumniStories from "@/components/admissions/AlumniStories";
import { LinkedInIcon } from "@/components/icons";
import { ADMISSIONS_NAV, localizePath } from "@/lib/nav";
// Placeholder interview data — see components/admissions/AlumniStories.tsx for details.
import alumniStories from "@/data/alumni-stories.json";

export const metadata: Metadata = { title: "Career Outcomes" };

const LINKEDIN_SEARCH_URL =
  "http://linkedin.com/search/results/all/?keywords=%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EA%B8%B0%EA%B3%84%EA%B3%B5%ED%95%99%EB%B6%80&origin=GLOBAL_SEARCH_HEADER";

export default function AdmissionsCareerPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="Career Outcomes"
        description="A look at where our graduates go next, told through their own stories."
        image="/images/new_mainbg/신입학_편입학_배경사진.jpg"
        imageAlt="Students on the athletic field at Yonsei University"
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="en" label="Admissions sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Admissions", path: "/admissions" }, { label: "Career Outcomes" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI STORIES</p>
            <h2 className="mt-3 font-display text-2xl text-ink">Alumni Stories</h2>
            <p className="mt-3 max-w-2xl text-ink/70">
              Graduates of our department share their experiences moving into corporate R&amp;D, graduate school, and
              startups.
            </p>
          </div>

          {/* Industry (robotic production line) image — mask-faded into the page
              background; soft navy overlay + warm grade keep the orange tones
              within the brand palette */}
          <ScrollReveal delayMs={100} className="hidden md:block">
            <ParallaxImage className="aspect-[3/2] md:-mr-8 lg:-mr-14" strength={20}>
              <Image
                src="/images/redesign_image/simon-kadula-8gr6bObQLOI-unsplash.jpg"
                alt="Automated production line with industrial robots in operation"
                fill
                sizes="(min-width: 768px) 42vw, 0px"
                className="object-cover"
                style={{ filter: "sepia(0.12) saturate(0.88)" }}
              />
              <div className="absolute inset-0 bg-primary/15" aria-hidden="true" />
            </ParallaxImage>
          </ScrollReveal>
        </div>

        <div className="mt-10">
          <AlumniStories stories={alumniStories} lang="en" />
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={localizePath("/about/directions", "en")} className="text-sm font-medium text-primary hover:underline">
            Submit or request an alumni interview →
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <a
            href={LINKEDIN_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-between gap-4 rounded-lg border border-line bg-white p-6 text-center transition-colors hover:border-primary-soft sm:flex-row sm:text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
                <LinkedInIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-base text-ink">Find Yonsei Mechanical Engineering Alumni</p>
                <p className="mt-0.5 text-sm text-ink/60">Explore the alumni network on LinkedIn.</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-medium text-primary">Open on LinkedIn ↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
