import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NewsArticleBoard from "@/components/NewsArticleBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "Research News" };

export default function NewsResearchPageEn() {
  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="Research News"
        description="Research achievements, academic activities, and event news from the faculty of Yonsei University's School of Mechanical Engineering."
      />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Research News" }]} />
      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <NewsArticleBoard lang="en" articles={BOARD_DATA.news} />
      </section>
    </>
  );
}
