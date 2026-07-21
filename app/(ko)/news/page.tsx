import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NoticeTabs from "@/components/NoticeTabs";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import { BOARD_DATA } from "@/lib/community-data";
import { NEWS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "공지사항" };

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="공지사항"
        description="연세대학교 기계공학부 공식 홈페이지의 학부·대학원·외부기관 공지사항과 장학생 선발공고를 원문 그대로 제공합니다."
      />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "공지사항" }]} />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 max-w-xl">
          <CommunitySearchBar lang="ko" />
        </div>
        <NoticeTabs
          lang="ko"
          boards={{
            "notices-undergraduate": BOARD_DATA["notices-undergraduate"],
            "notices-graduate": BOARD_DATA["notices-graduate"],
            "notices-external": BOARD_DATA["notices-external"],
            "notices-scholarship": BOARD_DATA["notices-scholarship"],
          }}
        />
      </section>
    </>
  );
}
