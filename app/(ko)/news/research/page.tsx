import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NewsArticleBoard from "@/components/NewsArticleBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "뉴스" };

export default function NewsResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="뉴스"
        description="연세대학교 기계공학부 교수진의 연구 성과와 학술·행사 소식을 전합니다."
      />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "뉴스" }]} />
      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <NewsArticleBoard lang="ko" articles={BOARD_DATA.news} />
      </section>
    </>
  );
}
