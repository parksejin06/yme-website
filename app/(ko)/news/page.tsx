import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NoticeTable from "@/components/NoticeTable";
import notices from "@/data/notices.json";

export const metadata: Metadata = { title: "공지사항" };

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="NEWS"
        title="공지사항"
        description="학부 소식과 공지사항을 안내합니다. 연세대학교 기계공학부 실제 공지사항을 기반으로 구성되었습니다."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NoticeTable lang="ko" notices={notices} />
      </section>
    </>
  );
}
