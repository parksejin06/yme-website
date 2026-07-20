import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationRequirements, { type GraduateRequirementsData } from "@/components/graduate/GraduationRequirements";
import { GRADUATE_NAV } from "@/lib/nav";
import gradRequirements from "@/data/graduate-graduation-requirements.json";

export const metadata: Metadata = { title: "대학원 졸업 요건" };

export default function GraduateGraduationPage() {
  return (
    <>
      <PageHero eyebrow="GRADUATE" title="졸업 요건" description="과정을 선택하면 해당 과정의 최소 졸업학점과 학위 취득 절차를 확인할 수 있습니다." />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원", path: "/graduate" }, { label: "졸업 요건" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <GraduationRequirements data={gradRequirements as GraduateRequirementsData} lang="ko" />
      </section>
    </>
  );
}
