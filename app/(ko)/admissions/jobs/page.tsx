import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import JobBoard from "@/components/community/JobBoard";
import { ADMISSIONS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";
import { BOARD_META } from "@/lib/community-content";

export const metadata: Metadata = { title: "채용정보·인턴십" };

export default function AdmissionsJobsPage() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="채용정보·인턴십"
        description="기계공학부 취업정보 게시판에 등록된 채용·인턴십 공고입니다."
        image="/images/new_mainbg/신입학_편입학_배경사진.jpg"
        imageAlt="연세대학교 운동장에서 운동하는 학생들"
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="ko" label="입학·진로 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "입학·진로", path: "/admissions" }, { label: "채용정보·인턴십" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <a
          href={BOARD_META.jobs.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          학과 취업정보 게시판 원본 바로가기 <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="mt-6">
          <JobBoard items={BOARD_DATA["jobs"]} lang="ko" />
        </div>
      </section>
    </>
  );
}
