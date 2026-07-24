import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ResourceLibrary from "@/components/community/ResourceLibrary";
import { NEWS_NAV } from "@/lib/nav";
import { getBoard } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Resources" };

export default async function ResourcesPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Resources" description="Download undergraduate and graduate forms and academic materials." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Resources" }]} />

      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <ResourceLibrary items={await getBoard("resources")} lang="en" />
      </section>
    </>
  );
}
