import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import Calendar from "@/components/community/Calendar";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";
import calendarData from "@/data/community/calendar-official.json";

export const metadata: Metadata = { title: "일정" };

export default function CalendarPage() {
  const relatedPosts = [
    ...BOARD_DATA.events.map((post) => ({ board: "events" as const, post })),
    ...BOARD_DATA.seminars.map((post) => ({ board: "seminars" as const, post })),
  ];

  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="일정"
        description="연세대학교 기계공학부 공식 캘린더의 세미나·행사 일정을 그대로 보여줍니다."
      />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "일정" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <Calendar events={calendarData.events} relatedPosts={relatedPosts} lang="ko" />
      </section>
    </>
  );
}
