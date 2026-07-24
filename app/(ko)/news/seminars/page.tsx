import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import SeminarBoard from "@/components/community/SeminarBoard";
import { NEWS_NAV } from "@/lib/nav";
import { getBoard } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "세미나" };

export default async function SeminarsPage() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="세미나" description="연구분야별 학술 세미나 일정과 연사 정보를 확인합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "세미나" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <SeminarBoard items={await getBoard("seminars")} lang="ko" />
      </section>
    </>
  );
}
