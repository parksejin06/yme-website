import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import CourseExplorer, { type CourseDetail } from "@/components/academics/CourseExplorer";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import curriculum from "@/data/curriculum.json";
import courses from "@/data/courses.json";

export const metadata: Metadata = { title: "교과목 소개" };

export default function UndergraduateCoursesPage() {
  const courseMap = new Map<string, CourseDetail>((courses as CourseDetail[]).map((c) => [c.courseCode, c]));

  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="교과목 소개" description="학년·학기별로 개설되는 전공·교양 교과목을 확인할 수 있습니다." image="/images/new_mainbg/학부_배경사진.jpg" imageAlt="연세대학교 언더우드관" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부", path: "/undergraduate" }, { label: "교과목 소개" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <CourseExplorer entries={curriculum} courseMap={courseMap} lang="ko" />
      </section>
    </>
  );
}
