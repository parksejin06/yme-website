import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ResourceLibrary from "@/components/community/ResourceLibrary";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "자료실" };

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="자료실" description="학부·대학원 서식과 학사 관련 자료를 다운로드할 수 있습니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "자료실" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <ResourceLibrary items={BOARD_DATA["resources"]} lang="ko" />
      </section>
    </>
  );
}
