import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import SeminarBoard from "@/components/community/SeminarBoard";
import { NEWS_NAV } from "@/lib/nav";
import { getBoard } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Seminars" };

export default async function SeminarsPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Seminars" description="Academic seminar schedules and speaker information by research field." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Seminars" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <SeminarBoard items={await getBoard("seminars")} lang="en" />
      </section>
    </>
  );
}
