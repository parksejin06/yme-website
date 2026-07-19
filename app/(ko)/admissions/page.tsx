import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "입학·진학·취업 정보" };

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS & CAREERS"
        title="입학·진학·취업 정보"
        description="신입학·편입학 안내부터 대학원 진학, 취업 정보까지 순차적으로 업데이트할 예정입니다."
      />
      <PlaceholderPage
        lang="ko"
        sections={["신입학·편입학 안내", "대학원 진학 안내", "졸업 후 진로·취업 현황", "채용정보·인턴십"]}
      />
    </>
  );
}
