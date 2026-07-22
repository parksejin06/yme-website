import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EmeritusFacultyGrid from "@/components/EmeritusFacultyGrid";
import { FACULTY_NAV } from "@/lib/nav";
import emeritus from "@/data/faculty-emeritus.json";

export const metadata: Metadata = { title: "명예·퇴임 교수" };

export default function EmeritusFacultyPage() {
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="명예·퇴임 교수"
        description={`연세대학교 기계공학부 발전에 기여해 오신 명예·퇴임 교수 ${emeritus.length}명을 소개합니다.`}
      />
      <SectionSubNav items={FACULTY_NAV} lang="ko" label="교수진 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "교수진", path: "/faculty" }, { label: "명예·퇴임 교수" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <EmeritusFacultyGrid faculty={emeritus} lang="ko" />
      </section>
    </>
  );
}
