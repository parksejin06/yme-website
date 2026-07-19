import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "동문·대외협력" };

export default function AlumniPage() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="동문·대외협력"
        description="동문 네트워크와 산학협력·대외협력 소식을 안내할 예정입니다."
      />
      <PlaceholderPage lang="ko" sections={["동문회 소개", "동문 인터뷰·소식", "산학협력 현황", "대외협력·MOU"]} />
    </>
  );
}
