import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AcademicResearchMap from "@/components/graduate/AcademicResearchMap";
import { GRADUATE_NAV } from "@/lib/nav";
import gradRequirements from "@/data/graduate-graduation-requirements.json";
import graduateCourses from "@/data/graduate-courses.json";
import faculty from "@/data/faculty.json";

export const metadata: Metadata = { title: "교육·연구 체계도" };

export default function GraduateCurriculumMapPage() {
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="교육·연구 체계도" description="관심 연구분야를 중심으로 대학원 과정과 교과목, 교수진을 탐색할 수 있습니다." />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원", path: "/graduate" }, { label: "교육·연구 체계도" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <AcademicResearchMap roadmap={gradRequirements.roadmap} courses={graduateCourses} faculty={faculty} lang="ko" />
      </section>
    </>
  );
}
