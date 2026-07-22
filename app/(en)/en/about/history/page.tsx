import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import HistoryAccordion from "@/components/HistoryAccordion";
import { ABOUT_NAV } from "@/lib/nav";
import history from "@/data/history.json";

export const metadata: Metadata = { title: "History" };

export default function HistoryPageEn() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="History" />
      <SectionSubNav items={ABOUT_NAV} lang="en" label="About sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "About", path: "/about" }, { label: "History" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">OUR STORY</p>
            <h2 className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
              A History Proven Through Challenge,
              <br />
              A School Moving Forward
            </h2>
            <p className="mt-5 text-ink/70">
              Since taking its first steps as the Department of Construction Engineering in 1958, more than six
              decades of challenge and growth have shaped what is now Yonsei University&apos;s School of Mechanical
              Engineering.
            </p>
          </div>

          <div>
            <HistoryAccordion entries={history} lang="en" />
          </div>
        </div>
      </section>
    </>
  );
}
