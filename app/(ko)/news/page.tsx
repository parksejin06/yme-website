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
        description="학부 소식과 공지사항을 안내합니다. (현재 더미 데이터로 구성되어 있으며, 실제 운영 시 data/notices.json 파일에 새 글을 추가하면 됩니다.)"
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <NoticeTable lang="ko" notices={notices} />
      </section>
    </>
  );
}
