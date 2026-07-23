import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationCheckWizard from "@/components/graduation-check/GraduationCheckWizard";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Graduation Requirement Check" };

export default function GraduationCheckPageEn() {
  return (
    <>
      <PageHero
        eyebrow="UNDERGRADUATE"
        title="Graduation Requirement Check"
        description="Enter the courses you've taken each semester to see how you stack up against your cohort's graduation requirements."
        image="/images/new_mainbg/학부_배경사진.jpg"
        imageAlt="Underwood Hall at Yonsei University"
      />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate", path: "/undergraduate" }, { label: "Graduation Requirement Check" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-8 rounded-lg border border-line bg-surface-muted/60 px-4 py-3 text-xs text-ink/50">
          Your input is stored only in this browser (localStorage) and is never sent to or stored on a server.
        </p>
        <GraduationCheckWizard lang="en" />
      </section>
    </>
  );
}
