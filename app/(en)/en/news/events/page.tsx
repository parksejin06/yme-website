import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EventBoard from "@/components/community/EventBoard";
import { NEWS_NAV } from "@/lib/nav";
import { getBoard } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Events" description="Department events, info sessions, competitions, and alumni gatherings." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Events" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <EventBoard items={await getBoard("events")} lang="en" />
      </section>
    </>
  );
}
