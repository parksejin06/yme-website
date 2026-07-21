import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { ABOUT_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Vision & Mission" };

export default function VisionPageEn() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="Vision & Mission" />
      <SectionSubNav items={ABOUT_NAV} lang="en" label="About sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "About", path: "/about" }, { label: "Vision & Mission" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">VISION</p>
        <blockquote className="mt-4 max-w-3xl text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;Relentless challenge, creating value for the world.&rdquo;
        </blockquote>
        <p className="mt-5 max-w-2xl text-ink/70">
          Since its founding in 1962, Yonsei University&apos;s School of Mechanical Engineering has cultivated talent
          who contribute to industry and academia across precision design, thermofluids, robotics/mechatronics,
          materials/structures, nano/bio, and energy.
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
      </section>
    </>
  );
}
