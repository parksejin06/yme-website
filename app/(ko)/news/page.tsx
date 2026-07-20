import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NoticeTable from "@/components/NoticeTable";
import notices from "@/data/notices.json";
import { NEWS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "공지사항" };

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="NEWS"
        title="공지사항"
        description="학부 소식과 공지사항을 안내합니다. 연세대학교 기계공학부 실제 공지사항을 기반으로 구성되었습니다."
      />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "공지사항" }]} />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NoticeTable lang="ko" notices={notices} />
      </section>
    </>
  );
}
