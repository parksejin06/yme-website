import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ScrollReveal from "@/components/ScrollReveal";
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
        <ol className="space-y-0 border-l border-line pl-8">
          {history.map((h, i) => (
            <ScrollReveal key={h.year + h.month} delayMs={Math.min(i * 40, 400)}>
              <li className="relative pb-9 last:pb-0">
                <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                <p className="font-display text-sm text-primary">
                  {h.year}.{h.month}
                </p>
                <p className="mt-1 text-ink/80">{h.en}</p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </section>
    </>
  );
}
