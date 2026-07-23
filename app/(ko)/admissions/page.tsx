import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AdmissionTypeTabs from "@/components/admissions/AdmissionTypeTabs";
import { ADMISSIONS_NAV } from "@/lib/nav";
import admissionsInfo from "@/data/admissions-info.json";

export const metadata: Metadata = { title: "신입학·편입학 안내" };

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="신입학·편입학 안내"
        description="연세대학교 기계공학부 입학 전형 개요와 전형별 모집요강 안내입니다."
        image="/images/new_mainbg/신입학_편입학_배경사진.jpg"
        imageAlt="연세대학교 운동장에서 운동하는 학생들"
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="ko" label="입학·진로 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "입학·진로" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ABOUT THE PROGRAM</p>
        <p className="mt-4 max-w-2xl text-ink/70">{admissionsInfo.overviewKr}</p>
        <p className="mt-3 max-w-2xl text-ink/70">
          신입학은 수시모집(학생부종합전형·학생부교과전형 등)과 정시모집으로 나뉘어 진행되며, 편입학은 신입학과는
          별도의 전형으로 재학생을 선발합니다. 정확한 모집 인원, 전형요소별 반영 비율, 수능 최저학력기준 등 매년
          바뀔 수 있는 수치 정보는 아래 전형별 링크의 연세대학교 입학처 공식 모집요강에서 반드시 확인하시기
          바랍니다.
        </p>

        <div className="mt-10">
          <AdmissionTypeTabs types={admissionsInfo.admissionTypes} lang="ko" />
        </div>
      </section>
    </>
  );
}
