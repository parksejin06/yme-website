import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AcademicsTabs from "@/components/AcademicsTabs";

export const metadata: Metadata = { title: "교육과정·학사 안내" };

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="ACADEMICS"
        title="교육과정·학사 안내"
        description="학부 졸업요건과 교육과정을 학번별로 확인할 수 있습니다. 대학원 교육과정은 확정되는 대로 반영됩니다."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <AcademicsTabs lang="ko" />
      </section>
    </>
  );
}
