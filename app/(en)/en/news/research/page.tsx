import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NewsArticleBoard from "@/components/NewsArticleBoard";
import { NEWS_NAV } from "@/lib/nav";
import articles from "@/data/news-articles.json";

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
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NewsArticleBoard lang="en" articles={articles} />
      </section>
    </>
  );
}
