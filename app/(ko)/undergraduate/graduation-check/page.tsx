import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import GraduationCheckWizard from "@/components/graduation-check/GraduationCheckWizard";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "졸업요건 자가진단" };

export default function GraduationCheckPage() {
  return (
    <>
      <PageHero
        eyebrow="UNDERGRADUATE"
        title="졸업요건 자가진단"
        description="학기별로 수강한 과목을 입력하면 졸업요건 대비 이수 현황을 확인할 수 있습니다."
      />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부", path: "/undergraduate" }, { label: "졸업요건 자가진단" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-8 rounded-lg border border-line bg-surface-muted/60 px-4 py-3 text-xs text-ink/50">
          입력한 정보는 이 브라우저에만 저장되며(localStorage), 서버로 전송되거나 저장되지 않습니다.
        </p>
        <GraduationCheckWizard lang="ko" />
      </section>
    </>
  );
}
