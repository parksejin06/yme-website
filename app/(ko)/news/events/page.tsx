import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EventBoard from "@/components/community/EventBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "행사" };

export default function EventsPage() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="행사" description="학부·학생·동문 행사, 설명회, 경진대회 등 학과 행사 정보를 확인합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "행사" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <EventBoard items={BOARD_DATA["events"]} lang="ko" />
      </section>
    </>
  );
}
