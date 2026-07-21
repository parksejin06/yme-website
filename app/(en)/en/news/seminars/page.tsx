import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import SeminarBoard from "@/components/community/SeminarBoard";
import { NEWS_NAV } from "@/lib/nav";
import seminars from "@/data/seminars.json";

export const metadata: Metadata = { title: "Seminars" };

export default function SeminarsPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Seminars" description="Academic seminar schedules and speaker information by research field." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Seminars" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <SeminarBoard items={seminars} lang="en" />
      </section>
    </>
  );
}
