import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { GRADUATE_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";
import gradRequirements from "@/data/graduate-graduation-requirements.json";

export const metadata: Metadata = { title: "대학원 소개" };

const QUICK_LINKS = [
  { path: "/graduate/graduation", title: "졸업 요건", desc: "석사·박사·석박사통합 과정별 최소 졸업학점과 학위 취득 절차를 확인합니다." },
  { path: "/graduate/courses", title: "교과목 소개", desc: "180여 개 대학원 교과목을 검색하고 연구분야별로 탐색합니다." },
  { path: "/graduate/curriculum-map", title: "교육·연구 체계도", desc: "관심 연구분야로 관련 교과목과 교수진을 함께 찾아봅니다." },
];

export default function GraduatePage() {
  return (
    <>
      <PageHero
        eyebrow="GRADUATE"
        title="대학원 소개"
        description="연세대학교 기계공학부 대학원은 연구 중심의 심화 교육을 통해 전문 연구자와 산업 리더를 양성합니다."
        image="/images/robotics-lab.jpg"
        imageAlt="기계공학부 대학원 연구실 실험 장면"
      />
      <SectionSubNav items={GRADUATE_NAV} lang="ko" label="대학원 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "대학원" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">GRADUATE PROGRAM</p>
        <p className="mt-4 max-w-2xl text-ink/70">
          대학원생은 입학 후 지도교수를 배정받아 전공 교과목 이수와 연구실 연구를 병행하며, 종합시험과 학위논문
          예비심사·본심사를 거쳐 학위를 취득합니다. 과정별 세부 요건은 졸업 요건 페이지에서, 개설 교과목은 교과목
          소개 페이지에서, 관심 연구분야에 맞는 교과목·교수진 연결은 교육·연구 체계도 페이지에서 확인할 수
          있습니다.
        </p>

        <div className="mt-10 rounded-lg border border-line bg-surface-muted/60 p-5">
          <p className="text-xs text-ink/45">
            자세한 대학원 입학 안내는 연세대학교 일반대학원 홈페이지에서 확인하실 수 있습니다.
          </p>
          <a
            href="https://graduate.yonsei.ac.kr/graduate/index.do"
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline"
          >
            일반대학원 입학 안내 바로가기 ↗
          </a>
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">대학원 바로가기</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.path}
                href={q.path}
                className="group flex items-start justify-between gap-3 rounded-lg border border-line bg-white p-5 transition-colors hover:border-primary-soft"
              >
                <div>
                  <p className="font-display text-base text-ink">{q.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{q.desc}</p>
                </div>
                <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {gradRequirements.programs.map((p) => (
              <div key={p.key} className="rounded-lg border border-line bg-white p-4">
                <p className="text-xs text-ink/45">{p.labelKr}</p>
                <p className="mt-1 font-display text-xl text-ink">최소 {p.credits}학점</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
