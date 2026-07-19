import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NoticeTable from "@/components/NoticeTable";
import notices from "@/data/notices.json";

export const metadata: Metadata = { title: "News" };

export default function NewsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="NEWS"
        title="News"
        description="Announcements from the school. (Currently populated with dummy data — add new entries to data/notices.json to publish real posts.)"
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NoticeTable lang="en" notices={notices} />
      </section>
    </>
  );
}
