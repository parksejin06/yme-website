import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabMediaLibrary from "@/components/graduate/LabMediaLibrary";
import { GRADUATE_NAV } from "@/lib/nav";
import labMediaData from "@/data/graduate-lab-media.json";
import type { LabMediaFile } from "@/lib/lab-media";

export const metadata: Metadata = { title: "연구실 소개 자료 및 영상" };

const data = labMediaData as LabMediaFile;

export default function LabMediaPage() {
  return (
    <>
      <PageHero
        eyebrow="GRADUATE LAB MEDIA"
        title="대학원 연구실 소개 자료 및 영상"
        description="관심 연구실의 소개 영상과 홍보 이미지를 통해 연구 주제와 대학원 연구 환경을 확인할 수 있습니다."
      />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원", path: "/graduate" }, { label: "연구실 소개 자료 및 영상" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <LabMediaLibrary items={data.items} lang="ko" />
      </section>
    </>
  );
}
