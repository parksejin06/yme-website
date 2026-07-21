import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AlumniStories from "@/components/admissions/AlumniStories";
import { LinkedInIcon } from "@/components/icons";
import { ADMISSIONS_NAV, localizePath } from "@/lib/nav";
// Placeholder interview data — see components/admissions/AlumniStories.tsx for details.
import alumniStories from "@/data/alumni-stories.json";

export const metadata: Metadata = { title: "졸업 후 진로·취업현황" };

const LINKEDIN_SEARCH_URL =
  "http://linkedin.com/search/results/all/?keywords=%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EA%B8%B0%EA%B3%84%EA%B3%B5%ED%95%99%EB%B6%80&origin=GLOBAL_SEARCH_HEADER";

export default function AdmissionsCareerPage() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="졸업 후 진로·취업현황"
        description="졸업한 선배들의 이야기로 살펴보는 기계공학부 졸업생의 다양한 진로."
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="ko" label="입학·진로 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "입학·진로", path: "/admissions" }, { label: "졸업 후 진로·취업현황" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI STORIES</p>
        <h2 className="mt-3 font-display text-2xl text-ink">선배들의 이야기</h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          기계공학부를 졸업한 선배들이 기업 연구개발, 대학원 진학, 창업 등 다양한 분야로 진출한 경험을 나눕니다.
        </p>

        <div className="mt-10">
          <AlumniStories stories={alumniStories} lang="ko" />
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={localizePath("/about/directions", "ko")} className="text-sm font-medium text-primary hover:underline">
            선배 인터뷰 제보/신청 문의하기 →
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <a
            href={LINKEDIN_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-between gap-4 rounded-lg border border-line bg-white p-6 text-center transition-colors hover:border-primary-soft sm:flex-row sm:text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
                <LinkedInIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-base text-ink">연세대학교 기계공학부 동문 찾기</p>
                <p className="mt-0.5 text-sm text-ink/60">LinkedIn에서 학부 선후배 네트워크를 확인해 보세요.</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-medium text-primary">LinkedIn에서 열기 ↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
