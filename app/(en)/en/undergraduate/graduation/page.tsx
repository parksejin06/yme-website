import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import DecadeYearPicker from "@/components/academics/DecadeYearPicker";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Graduation Requirements" };

export default function UndergraduateGraduationPageEn() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="Graduation Requirements" description="Select your cohort year to view the graduation requirements that apply to you." />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate", path: "/undergraduate" }, { label: "Graduation Requirements" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-6 text-sm text-ink/60">
          Select your cohort decade, then your specific cohort, to view graduation requirements.
        </p>
        <DecadeYearPicker lang="en" />
      </section>
    </>
  );
}
