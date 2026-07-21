import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EventBoard from "@/components/community/EventBoard";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "Events" };

export default function EventsPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Events" description="Department events, info sessions, competitions, and alumni gatherings." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Events" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <EventBoard items={BOARD_DATA["events"]} lang="en" />
      </section>
    </>
  );
}
