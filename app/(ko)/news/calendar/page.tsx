import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import Calendar from "@/components/community/Calendar";
import { NEWS_NAV } from "@/lib/nav";
import { buildCalendarEvents } from "@/lib/community";
import thesisReviews from "@/data/thesis-reviews.json";
import events from "@/data/community-events.json";
import seminars from "@/data/seminars.json";
import jobs from "@/data/jobs.json";

export const metadata: Metadata = { title: "일정" };

export default function CalendarPage() {
  const calendarEvents = buildCalendarEvents({ thesisReviews, events, seminars, jobs });

  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="일정" description="학사·학위논문·행사·세미나·취업 일정을 한눈에 확인합니다." />
      <SectionSubNav items={NEWS_NAV} lang="ko" label="뉴스 및 공지사항 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "뉴스 및 공지사항", path: "/news" }, { label: "일정" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <Calendar events={calendarEvents} lang="ko" />
      </section>
    </>
  );
}
