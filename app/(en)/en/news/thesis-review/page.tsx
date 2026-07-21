import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ThesisReviewBoard from "@/components/community/ThesisReviewBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "Thesis Review" };

export default function ThesisReviewPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Thesis Review" description="Thesis review notices for Master's, Doctoral, and Combined program students." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Thesis Review" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <ThesisReviewBoard items={BOARD_DATA["thesis-reviews"]} lang="en" />
      </section>
    </>
  );
}
