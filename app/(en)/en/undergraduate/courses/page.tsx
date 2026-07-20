import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import CourseExplorer, { type CourseDetail } from "@/components/academics/CourseExplorer";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import curriculum from "@/data/curriculum.json";
import courses from "@/data/courses.json";

export const metadata: Metadata = { title: "Courses" };

export default function UndergraduateCoursesPageEn() {
  const courseMap = new Map<string, CourseDetail>((courses as CourseDetail[]).map((c) => [c.courseCode, c]));

  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="Courses" description="Browse major and liberal-arts courses offered by year and semester." />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="en" label="Undergraduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Undergraduate", path: "/undergraduate" }, { label: "Courses" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <CourseExplorer entries={curriculum} courseMap={courseMap} lang="en" />
      </section>
    </>
  );
}
