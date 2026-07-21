import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import CurriculumMap from "@/components/undergraduate/CurriculumMap";
import { type CourseDetail } from "@/components/academics/CourseExplorer";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import curriculum from "@/data/curriculum.json";
import courses from "@/data/courses.json";

export const metadata: Metadata = { title: "Curriculum Map" };

export default function UndergraduateCurriculumMapPageEn() {
  const courseMap = new Map<string, CourseDetail>((courses as CourseDetail[]).map((c) => [c.courseCode, c]));

  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="Curriculum Map" description="See how courses connect from year 1 through year 4." />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate", path: "/undergraduate" }, { label: "Curriculum Map" }]} />

      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20">
        <CurriculumMap entries={curriculum} courseMap={courseMap} lang="en" />
      </section>
    </>
  );
}
