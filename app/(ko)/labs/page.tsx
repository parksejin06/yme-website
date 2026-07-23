import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabsExplorer from "@/components/labs/LabsExplorer";
import labs from "@/data/labs.json";
import type { LabEntry } from "@/lib/labs";
import { LABS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "연구실·연구분야 소개" };

export default async function LabsPage({ searchParams }: { searchParams: Promise<{ field?: string }> }) {
  const { field } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="연구실·연구분야 소개"
        description={`역학·소재, 에너지·열유체, 로보틱스·제어, 설계·제조, 마이크로·나노, 바이오·포토닉스 6개 연구분야에서 활동하는 ${labs.length}개 연구실을 소개합니다. 분야를 선택하면 소속 연구실 목록을 볼 수 있습니다.`}
        image="/images/new_mainbg/연구실_배경사진.jpg"
        imageAlt="연세대학교 독수리상 야경" imagePosition="center 88%"
      />
      <SectionSubNav items={LABS_NAV} lang="ko" label="연구실 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "연구실" }]} />
      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <LabsExplorer lang="ko" labs={labs as LabEntry[]} initialField={field} />
      </section>
    </>
  );
}
