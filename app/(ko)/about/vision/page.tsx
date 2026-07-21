import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { ABOUT_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "비전·교육목표" };

export default function VisionPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="비전·교육목표" />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부소개", path: "/about" }, { label: "비전·교육목표" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">VISION</p>
        <blockquote className="mt-4 max-w-3xl text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;멈추지 않는 도전으로 세상에 유익한 가치를 만듭니다.&rdquo;
        </blockquote>
        <p className="mt-5 max-w-2xl text-ink/70">
          연세대학교 기계공학부는 1962년 설립 이래 정밀·설계, 열유체, 로봇·메카트로닉스, 재료·구조, 나노·바이오,
          에너지 등 폭넓은 연구분야에서 산업 현장과 학문의 최전선에 기여하는 인재를 길러왔습니다.
        </p>

        <div className="mt-14 border-t border-line pt-14">
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">교육목적</p>
          <p className="mt-3 max-w-2xl text-balance font-display text-xl text-ink sm:text-2xl">
            창의적 사고와 도전정신을 바탕으로 종합 설계 능력을 갖추고 글로벌 사회에 유익한 가치를 창출할 수 있는
            인재 양성
          </p>
          <p className="mt-5 text-sm text-ink/60">
            학부 프로그램의 5가지 세부 교육목표는 학부 페이지에서 자세히 확인할 수 있습니다.
          </p>
          <Link
            href="/undergraduate/goals"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            학부 교육목표 자세히 보기 <ChevronRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
