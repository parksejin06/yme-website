import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import JobBoard from "@/components/community/JobBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "취업정보" };

export default function JobsPage() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="취업정보" description="신입·인턴·연구직 채용 및 대학원 진학·연구기회 정보를 확인합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "취업정보" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <JobBoard items={BOARD_DATA["jobs"]} lang="ko" />
      </section>
    </>
  );
}
