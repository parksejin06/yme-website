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

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPageEn() {
  const calendarEvents = buildCalendarEvents({ thesisReviews, events, seminars, jobs });

  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Calendar" description="Academic, thesis review, event, seminar, and job deadlines at a glance." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Calendar" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <Calendar events={calendarEvents} lang="en" />
      </section>
    </>
  );
}
