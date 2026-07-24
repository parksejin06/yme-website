import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import SearchResults from "@/components/community/SearchResults";
import { NEWS_NAV } from "@/lib/nav";
import { searchAllPosts } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "통합검색" };

export default async function CommunitySearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchAllPosts(q);

  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="통합검색" description="공지사항, 뉴스, 학위논문심사, 자료실, 채용정보·인턴십, 행사, 세미나를 한 번에 검색합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "통합검색" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <CommunitySearchBar lang="ko" initialQuery={q} />
        <div className="mt-8">
          <SearchResults results={results} query={q} lang="ko" />
        </div>
      </section>
    </>
  );
}
