import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduateCourseExplorer from "@/components/graduate/GraduateCourseExplorer";
import { GRADUATE_NAV } from "@/lib/nav";
import graduateCourses from "@/data/graduate-courses.json";

export const metadata: Metadata = { title: "Graduate Courses" };

export default function GraduateCoursesPageEn() {
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="Courses" description="Search graduate-level courses and browse them by research area." />
      <SectionSubNav items={GRADUATE_NAV} lang="en" label="Graduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Graduate", path: "/graduate" }, { label: "Courses" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <GraduateCourseExplorer courses={graduateCourses} lang="en" />
      </section>
    </>
  );
}
