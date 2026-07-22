import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabMediaLibrary from "@/components/labs/LabMediaLibrary";
import { LABS_NAV } from "@/lib/nav";
import labMediaData from "@/data/labs-media.json";
import type { LabMediaFile } from "@/lib/lab-media";

export const metadata: Metadata = { title: "연구실 소개 자료 및 영상" };

const data = labMediaData as LabMediaFile;

export default function LabsMediaPage() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="연구실 소개 자료 및 영상"
        description="관심 연구실의 소개 영상과 홍보 이미지를 통해 연구 주제와 연구 환경을 확인할 수 있습니다."
      />
      <SectionSubNav items={LABS_NAV} lang="ko" label="연구실 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "연구실", path: "/labs" }, { label: "연구실 소개 자료 및 영상" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <LabMediaLibrary items={data.items} lang="ko" />
      </section>
    </>
  );
}
