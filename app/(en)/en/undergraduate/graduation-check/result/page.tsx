import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationCheckResult from "@/components/graduation-check/GraduationCheckResult";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Graduation Requirement Check Results" };

export default function GraduationCheckResultPageEn() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="Graduation Requirement Check Results" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb
        lang="en"
        items={[
          { label: "Undergraduate", path: "/undergraduate" },
          { label: "Graduation Requirement Check", path: "/undergraduate/graduation-check" },
          { label: "Results" },
        ]}
      />
      <GraduationCheckResult lang="en" />
    </>
  );
}
