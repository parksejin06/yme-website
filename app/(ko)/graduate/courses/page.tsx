import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduateCourseExplorer from "@/components/graduate/GraduateCourseExplorer";
import { GRADUATE_NAV } from "@/lib/nav";
import graduateCourses from "@/data/graduate-courses.json";

export const metadata: Metadata = { title: "대학원 교과목 소개" };

export default function GraduateCoursesPage() {
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="교과목 소개" description="대학원에서 개설되는 전공 교과목을 검색하고 연구분야별로 탐색할 수 있습니다." />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원", path: "/graduate" }, { label: "교과목 소개" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <GraduateCourseExplorer courses={graduateCourses} lang="ko" />
      </section>
    </>
  );
}
