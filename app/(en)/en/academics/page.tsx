import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AcademicsTabs from "@/components/AcademicsTabs";

export const metadata: Metadata = { title: "Academics" };

export default function AcademicsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ACADEMICS"
        title="Academics"
        description="Undergraduate graduation requirements and curriculum are available by cohort year below. Graduate program information will be added once finalized."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <AcademicsTabs lang="en" />
      </section>
    </>
  );
}
