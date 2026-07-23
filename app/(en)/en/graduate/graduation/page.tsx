import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationRequirements, { type GraduateRequirementsData } from "@/components/graduate/GraduationRequirements";
import { GRADUATE_NAV } from "@/lib/nav";
import gradRequirements from "@/data/graduate-graduation-requirements.json";

export const metadata: Metadata = { title: "Graduate Graduation Requirements" };

export default function GraduateGraduationPageEn() {
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="Graduation Requirements" description="Select a program to see its minimum graduation credits and degree procedures." image="/images/new_mainbg/대학원_new.png" imageAlt="Graduate students conducting a lab experiment" />
      <SectionSubNav items={GRADUATE_NAV} lang="en" label="Graduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Graduate", path: "/graduate" }, { label: "Graduation Requirements" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <GraduationRequirements data={gradRequirements as GraduateRequirementsData} lang="en" />
      </section>
    </>
  );
}
