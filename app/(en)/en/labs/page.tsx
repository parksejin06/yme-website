import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabsExplorer from "@/components/labs/LabsExplorer";
import labs from "@/data/labs.json";
import type { LabEntry } from "@/lib/labs";
import { LABS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Research Labs" };

export default async function LabsPageEn({ searchParams }: { searchParams: Promise<{ field?: string }> }) {
  const { field } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="Research Labs"
        description={`Explore ${labs.length} laboratories across 6 research fields: Mechanics & Materials, Energy & Thermofluids, Robotics & Control, Design & Manufacturing, Micro & Nano, and Bio & Photonics. Select a field to see its laboratories.`}
      />
      <SectionSubNav items={LABS_NAV} lang="en" label="Research Labs sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Research Labs" }]} />
      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <LabsExplorer lang="en" labs={labs as LabEntry[]} initialField={field} />
      </section>
    </>
  );
}
