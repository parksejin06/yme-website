import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import StatCounter from "@/components/StatCounter";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import SocialSection from "@/components/home/SocialSection";
import history from "@/data/history.json";
import notices from "@/data/notices.json";

const foundingYear = 1962;
const currentYear = new Date().getFullYear();

export default function HomePage() {
  const recentHistory = history.slice(-5).reverse();
  const recentNotices = notices.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/main-bg.png"
          alt="연세대학교 신촌캠퍼스 항공뷰"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,42,87,0.4) 0%, rgba(15,42,87,0.45) 55%, rgba(15,42,87,0.55) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-content px-4 py-28 text-center sm:px-6">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl md:text-7xl">
            <span className="block">YONSEI UNIVERSITY</span>
            <span className="mt-1 block text-[0.73em] sm:mt-2 md:mt-3">MECHANICAL ENGINEERING</span>
          </h1>
          <p className="mt-6 text-balance font-body text-base text-white/90 sm:text-lg">
            멈추지 않는 도전으로 세상에 유익한 가치를 만듭니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="rounded-full bg-white px-6 py-3 text-sm font-body text-primary transition-colors hover:bg-white/90"
            >
              학부 소개 보기
            </Link>
            <Link
              href="/labs"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-body text-white transition-colors hover:bg-white/10"
            >
              연구실 둘러보기
            </Link>
          </div>
        </div>

        <a
          href="#vision-teaser"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/90 drop-shadow-md transition-colors hover:text-white sm:bottom-10"
        >
          <span className="font-body text-xs font-medium tracking-[0.2em]">Scroll to Explore</span>
          <ChevronDown className="h-5 w-5 animate-soft-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* Vision teaser */}
      <section id="vision-teaser" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <ScrollSlideIn>
            <Image
              src="/images/home_image_2.jpg"
              alt="연세대학교 공학관에서 학습하는 학생들"
              width={640}
              height={800}
              className="h-auto w-full rounded-lg object-cover"
            />
          </ScrollSlideIn>
          <ScrollReveal delayMs={120}>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">SINCE {foundingYear}</p>
            <h2 className="mt-4 text-balance font-display text-2xl text-ink sm:text-3xl">
              {currentYear - foundingYear}년간 이어온 도전의 역사
            </h2>
            <p className="mt-5 text-ink/70">
              1962년 이공대학 공학부 기계공학과로 첫걸음을 뗀 이후, 연세대학교 기계공학부는 산업 현장과 학문의
              최전선에서 끊임없이 도전해 왔습니다. 정밀기계에서 로봇공학, 나노기술, 에너지 시스템까지 — 오늘도
              세상에 유익한 가치를 만드는 연구가 이어지고 있습니다.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block border-b border-primary text-sm font-body text-primary"
            >
              학부 연혁 전체보기 →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16 sm:py-20">
        <ScrollReveal className="mx-auto grid max-w-content grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
          <StatCounter value={currentYear - foundingYear} suffix="주년" label="설립 이래" />
          <StatCounter value={26} suffix="개" label="연구실" />
          <StatCounter value={6} suffix="개" label="전문 연구분야" />
          <StatCounter value={10} suffix="개" label="산학협력 네트워크" />
        </ScrollReveal>
      </section>

      {/* Quick links */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-balance font-display text-2xl text-ink sm:text-3xl">둘러보기</h2>
          </ScrollReveal>
        </div>

        <div className="mt-10">
          <ImageAutoSlider lang="ko" />
        </div>
      </section>

      {/* History teaser */}
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-balance font-display text-2xl text-ink sm:text-3xl">최근 연혁</h2>
          </ScrollReveal>
          <ol className="mt-10 space-y-0 border-l border-line pl-8">
            {recentHistory.map((h, i) => (
              <ScrollReveal key={h.year + h.month} delayMs={i * 70}>
                <li className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                  <p className="font-display text-sm text-primary">
                    {h.year}. {h.month}
                  </p>
                  <p className="mt-1 text-ink/80">{h.kr}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
          <Link href="/about" className="mt-4 inline-block border-b border-primary text-sm font-body text-primary">
            전체 연혁 보기 →
          </Link>
        </div>
      </section>

      <SocialSection lang="ko" />

      {/* News teaser */}
      <section className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex items-center justify-between">
          <ScrollReveal>
            <h2 className="text-balance font-display text-2xl text-ink sm:text-3xl">공지사항</h2>
          </ScrollReveal>
          <Link href="/news" className="text-sm font-body text-primary">
            전체보기 →
          </Link>
        </div>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {recentNotices.map((n) => (
            <li key={n.no} className="flex items-center justify-between gap-4 py-4">
              <Link href="/news" className="flex min-w-0 items-center gap-2 hover:text-primary">
                {n.isNew && (
                  <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    N
                  </span>
                )}
                <span className="truncate text-sm text-ink/85">{n.titleKr}</span>
              </Link>
              <span className="shrink-0 text-xs text-ink/70">{n.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
