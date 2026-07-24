import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import Calendar from "@/components/community/Calendar";
import { NEWS_NAV } from "@/lib/nav";
import { getBoard } from "@/lib/community-data";
import calendarData from "@/data/community/calendar-official.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPageEn() {
  const [events, seminars] = await Promise.all([getBoard("events"), getBoard("seminars")]);
  const relatedPosts = [
    ...events.map((post) => ({ board: "events" as const, post })),
    ...seminars.map((post) => ({ board: "seminars" as const, post })),
  ];

  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="Calendar"
        description="Seminar and event dates exactly as shown on the official Yonsei ME calendar."
      />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Calendar" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <Calendar events={calendarData.events} relatedPosts={relatedPosts} lang="en" />
      </section>
    </>
  );
}
