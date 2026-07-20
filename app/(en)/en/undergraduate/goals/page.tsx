import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Education Goals" };

const GOALS = [
  "Develop creative thinking methods and design skills, along with engineering and research capabilities that apply mechanical engineering fundamentals to comprehensive, cross-disciplinary engineering design.",
  "Build the ability to communicate ideas effectively, work in teams, and lead — including the skills to manage and run an organization.",
  "Develop the ability to take on hard-to-predict future technologies, develop new technologies, and apply them beneficially in new environments.",
  "Cultivate lifelong self-development, an open and critically inquisitive mindset, and awareness of the social and ethical responsibility that comes with one's research and development work.",
  "Build awareness of the engineer's international role in a global society, along with the capacity to grow into a leader in industry, education, research, and public institutions.",
];

export default function GoalsPageEn() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="Education Goals" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate", path: "/undergraduate" }, { label: "Education Goals" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div>
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">EDUCATIONAL OBJECTIVE</p>
          <p className="mt-3 max-w-2xl text-balance font-display text-xl text-ink sm:text-2xl">
            Cultivating talent with creative thinking and comprehensive design capability who create value beneficial
            to a global society.
          </p>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-lg text-ink">Program-Level Learning Objectives</h2>
          <ol className="mt-6 space-y-6">
            {GOALS.map((g, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm text-primary">
                  {i + 1}
                </span>
                <p className="pt-1 text-ink/80">{g}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
