import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ThesisReviewBoard from "@/components/community/ThesisReviewBoard";
import { NEWS_NAV } from "@/lib/nav";
import thesisReviews from "@/data/thesis-reviews.json";

export const metadata: Metadata = { title: "학위논문심사" };

export default function ThesisReviewPage() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="학위논문심사" description="석사·박사·석박사통합 과정 학위논문심사 공고를 확인합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "학위논문심사" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <ThesisReviewBoard items={thesisReviews} lang="ko" />
      </section>
    </>
  );
}
