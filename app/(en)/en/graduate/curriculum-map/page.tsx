import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AcademicResearchMap from "@/components/graduate/AcademicResearchMap";
import { GRADUATE_NAV } from "@/lib/nav";
import gradRequirements from "@/data/graduate-graduation-requirements.json";
import graduateCourses from "@/data/graduate-courses.json";
import { getFaculty } from "@/lib/faculty-data";

export const metadata: Metadata = { title: "Academic & Research Map" };
export const dynamic = "force-dynamic";

export default async function GraduateCurriculumMapPageEn() {
  const faculty = await getFaculty();
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="Academic & Research Map" description="Explore graduate programs, courses, and faculty around your research interests." image="/images/new_mainbg/대학원_new.png" imageAlt="Graduate students conducting a lab experiment" />
      <SectionSubNav items={GRADUATE_NAV} lang="en" label="Graduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Graduate", path: "/graduate" }, { label: "Academic & Research Map" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <AcademicResearchMap roadmap={gradRequirements.roadmap} courses={graduateCourses} faculty={faculty} lang="en" />
      </section>
    </>
  );
}
