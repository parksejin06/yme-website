import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import DecadeYearPicker from "@/components/academics/DecadeYearPicker";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "졸업 요건" };

export default function UndergraduateGraduationPage() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="졸업 요건" description="학번을 선택하면 나에게 해당하는 졸업 요건을 확인할 수 있습니다." image="/images/new_mainbg/학부_배경사진.jpg" imageAlt="연세대학교 언더우드관" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부", path: "/undergraduate" }, { label: "졸업 요건" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-6 text-sm text-ink/60">
          학번 시대를 먼저 선택한 뒤, 세부 학번을 선택하면 졸업요건을 확인할 수 있습니다.
        </p>
        <DecadeYearPicker lang="ko" />
      </section>
    </>
  );
}
