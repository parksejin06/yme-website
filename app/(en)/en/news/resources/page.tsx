import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ResourceLibrary from "@/components/community/ResourceLibrary";
import { NEWS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Resources" description="Download undergraduate and graduate forms and academic materials." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Resources" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <ResourceLibrary items={BOARD_DATA["resources"]} lang="en" />
      </section>
    </>
  );
}
