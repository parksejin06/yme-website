import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LabsExplorer from "@/components/labs/LabsExplorer";
import labs from "@/data/labs.json";
import type { LabEntry } from "@/lib/labs";

export const metadata: Metadata = { title: "연구실·연구분야 소개" };

export default function LabsPage() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="연구실·연구분야 소개"
        description="역학·소재, 에너지·열유체, 로보틱스·제어, 설계·제조, 마이크로·나노, 바이오·포토닉스 6개 연구분야에서 활동하는 32개 연구실을 소개합니다. 분야를 선택하면 소속 연구실 목록을 볼 수 있습니다."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <LabsExplorer lang="ko" labs={labs as LabEntry[]} />
      </section>
    </>
  );
}
