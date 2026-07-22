import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import StatCounter from "@/components/StatCounter";
import HistoryAccordion from "@/components/HistoryAccordion";
import SocialSection from "@/components/home/SocialSection";
import LatestUpdatesSection from "@/components/home/LatestUpdatesSection";
import history from "@/data/history.json";
import labs from "@/data/labs.json";

const foundingYear = 1962;
const currentYear = new Date().getFullYear();

export default function HomePage() {
  const recentHistory = history.slice(-5);

  return (
    <>
      {/* Hero — asymmetric, bottom-left anchored editorial composition */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        <Image
          src="/images/main-bg.png"
          alt="연세대학교 신촌캠퍼스 항공뷰"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Bottom-weighted navy wash: legibility for the bottom-left text block,
            plus a lighter top band for the transparent header state */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,29,64,0.5) 0%, rgba(8,29,64,0.18) 30%, rgba(8,29,64,0.32) 62%, rgba(8,29,64,0.78) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-content px-[var(--page-gutter)] pb-24 pt-40 sm:pb-28">
          <div className="max-w-3xl">
            <p className="font-body text-xs font-medium tracking-[0.3em] text-white/70 sm:text-sm">
              YONSEI UNIVERSITY · SINCE {foundingYear}
            </p>
            <h1 className="mt-5 font-display leading-[1.08] text-white" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}>
              MECHANICAL
              <br />
              ENGINEERING
            </h1>
            <p className="mt-7 max-w-md border-l border-white/40 pl-5 font-body text-base leading-relaxed text-white/85 sm:text-lg">
              멈추지 않는 도전으로
              <br />
              세상에 유익한 가치를 만듭니다.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Link href="/about" className="link-rule font-body text-sm tracking-wide text-white">
                학부 소개 보기 <span aria-hidden="true">→</span>
              </Link>
              <Link href="/labs" className="link-rule font-body text-sm tracking-wide text-white">
                연구실 둘러보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Vertical editorial caption, bottom-right */}
        <p
          className="absolute bottom-24 right-6 z-10 hidden font-body text-[11px] tracking-[0.35em] text-white/50 md:block lg:right-10"
          style={{ writingMode: "vertical-rl" }}
          aria-hidden="true"
        >
          SEOUL · SINCHON CAMPUS
        </p>

        <a
          href="#vision-teaser"
          className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-white/80 transition-colors hover:text-white md:flex lg:right-10"
          aria-label="아래로 스크롤"
        >
          <ChevronDown className="h-4 w-4 animate-soft-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* Vision teaser */}
      <section id="vision-teaser" className="mx-auto max-w-content overflow-x-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <ScrollSlideIn>
            <Image
              src="/images/home_image_2.jpg"
              alt="연세대학교 공학관에서 학습하는 학생들"
              width={640}
              height={800}
              className="h-auto w-full object-cover"
            />
          </ScrollSlideIn>
          <ScrollReveal delayMs={120}>
            <p className="font-body text-xs font-medium tracking-[0.25em] text-accent">SINCE {foundingYear}</p>
            <h2 className="mt-5 text-balance font-display text-[1.75rem] leading-snug text-ink sm:text-4xl">
              {currentYear - foundingYear}년간 이어온 도전의 역사
            </h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              1962년 이공대학 공학부 기계공학과로 첫걸음을 뗀 이후, 연세대학교 기계공학부는 산업 현장과 학문의
              최전선에서 끊임없이 도전해 왔습니다. 정밀기계에서 로봇공학, 나노기술, 에너지 시스템까지 — 오늘도
              세상에 유익한 가치를 만드는 연구가 이어지고 있습니다.
            </p>
            <Link href="/about" className="link-rule mt-8 inline-block text-sm font-body text-primary">
              학부 연혁 전체보기 <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats — inverted navy ledger band: hairline-divided figures, no icons */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-content px-[var(--page-gutter)]">
          <div className="grid grid-cols-2 gap-y-10 border-t border-white/15 pt-10 md:grid-cols-4 md:divide-x md:divide-white/15 md:gap-y-0">
            <div className="md:pr-10">
              <StatCounter value={currentYear - foundingYear} suffix="주년" label="설립 이래" />
            </div>
            <div className="md:px-10">
              <StatCounter value={labs.length} suffix="개" label="연구실" />
            </div>
            <div className="md:px-10">
              <StatCounter value={6} suffix="개" label="전문 연구분야" />
            </div>
            <div className="md:pl-10">
              <StatCounter value={10} suffix="개" label="산학협력 네트워크" />
            </div>
          </div>
        </div>
      </section>

      <LatestUpdatesSection lang="ko" />

      {/* History teaser */}
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <ScrollReveal>
              <p className="font-body text-xs font-medium tracking-[0.25em] text-accent">HISTORY</p>
              <h2 className="mt-5 text-balance font-display text-[1.75rem] leading-snug text-ink sm:text-4xl">
                도전으로 증명한 역사,
                <br />
                미래로 나아가는 학부
              </h2>
              <p className="mt-6 leading-relaxed text-ink/70">
                1958년 건설공학과로 첫걸음을 뗀 이후, 반세기가 넘는 시간 동안 쌓아온 도전과 성장의 기록이 오늘의
                연세대학교 기계공학부를 만들어왔습니다.
              </p>
            </ScrollReveal>

            <div>
              <HistoryAccordion entries={recentHistory} lang="ko" />
              <Link href="/about/history" className="link-rule mt-8 inline-block text-sm font-body text-primary">
                전체 연혁 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SocialSection lang="ko" />
    </>
  );
}
