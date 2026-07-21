import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationCheckResult from "@/components/graduation-check/GraduationCheckResult";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "졸업요건 자가진단 결과" };

export default function GraduationCheckResultPage() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="졸업요건 자가진단 결과" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb
        lang="ko"
        items={[
          { label: "학부", path: "/undergraduate" },
          { label: "졸업요건 자가진단", path: "/undergraduate/graduation-check" },
          { label: "결과" },
        ]}
      />
      <GraduationCheckResult lang="ko" />
    </>
  );
}
