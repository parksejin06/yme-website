import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import FacultyGrid from "@/components/FacultyGrid";
import { FACULTY_NAV } from "@/lib/nav";
import faculty from "@/data/faculty.json";

export const metadata: Metadata = { title: "전임교수" };

export default function FacultyPage() {
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="전임교수"
        description={`역학·소재, 에너지·열유체, 로보틱스·제어, 설계·제조, 마이크로·나노, 바이오·포토닉스 6개 연구분야에서 활동하는 교수진 ${faculty.length}명을 소개합니다. 카드를 클릭하면 연락처와 연구실 정보를 볼 수 있습니다.`}
      />
      <SectionSubNav items={FACULTY_NAV} lang="ko" label="교수진 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "교수진" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <FacultyGrid lang="ko" members={faculty} />
      </section>
    </>
  );
}
