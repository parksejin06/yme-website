import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NoticeTabs from "@/components/NoticeTabs";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import { BOARD_DATA } from "@/lib/community-data";
import { NEWS_NAV } from "@/lib/nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Notices" };

export default function NewsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="Notices"
        description="Undergraduate, graduate, external, and scholarship notices, reproduced verbatim from the official Yonsei University School of Mechanical Engineering website."
      />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Notices" }]} />
      <section className="mx-auto max-w-content px-[var(--page-gutter)] py-[var(--section-space)]">
        <div className="mb-10 max-w-2xl">
          <CommunitySearchBar lang="en" />
        </div>
        <NoticeTabs
          lang="en"
          boards={{
            "notices-undergraduate": BOARD_DATA["notices-undergraduate"],
            "notices-graduate": BOARD_DATA["notices-graduate"],
            "notices-external": BOARD_DATA["notices-external"],
            "notices-scholarship": BOARD_DATA["notices-scholarship"],
          }}
        />
      </section>
    </>
  );
}
