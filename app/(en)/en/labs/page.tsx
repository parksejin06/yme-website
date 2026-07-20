import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LabsExplorer from "@/components/labs/LabsExplorer";
import labs from "@/data/labs.json";
import type { LabEntry } from "@/lib/labs";

export const metadata: Metadata = { title: "Research Labs" };

export default function LabsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="Research Labs"
        description="Explore 32 laboratories across 6 research fields: Mechanics & Materials, Energy & Thermofluids, Robotics & Control, Design & Manufacturing, Micro & Nano, and Bio & Photonics. Select a field to see its laboratories."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <LabsExplorer lang="en" labs={labs as LabEntry[]} />
      </section>
    </>
  );
}
