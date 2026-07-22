import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import SearchResults from "@/components/community/SearchResults";
import { NEWS_NAV } from "@/lib/nav";
import { searchAllPosts } from "@/lib/community-data";

export const metadata: Metadata = { title: "Search" };

export default async function CommunitySearchPageEn({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = searchAllPosts(q);

  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Search" description="Search notices, news, thesis reviews, resources, events, and seminars all at once." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Search" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <CommunitySearchBar lang="en" initialQuery={q} />
        <div className="mt-8">
          <SearchResults results={results} query={q} lang="en" />
        </div>
      </section>
    </>
  );
}
