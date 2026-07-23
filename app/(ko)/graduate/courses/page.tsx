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
      <PageHero eyebrow="GRADUATE" title="교과목 소개" description="대학원에서 개설되는 전공 교과목을 검색하고 연구분야별로 탐색할 수 있습니다." image="/images/new_mainbg/대학원_new.png" imageAlt="기계공학부 대학원 연구실 실험 장면" />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원", path: "/graduate" }, { label: "교과목 소개" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <GraduateCourseExplorer courses={graduateCourses} lang="ko" />
      </section>
    </>
  );
}
