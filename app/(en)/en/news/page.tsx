import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import NoticeTable from "@/components/NoticeTable";
import notices from "@/data/notices.json";
import { NEWS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Notices" };

export default function NewsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="NEWS & COMMUNITY"
        title="Notices"
        description="Announcements from the school, based on actual notices from the Yonsei University School of Mechanical Engineering."
      />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Notices" }]} />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NoticeTable lang="en" notices={notices} />
      </section>
    </>
  );
}
