import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import HistoryAccordion from "@/components/HistoryAccordion";
import ParallaxImage from "@/components/ParallaxImage";
import ScrollReveal from "@/components/ScrollReveal";
import { ABOUT_NAV } from "@/lib/nav";
import history from "@/data/history.json";

export const metadata: Metadata = { title: "연혁" };

export default function HistoryPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="연혁" image="/images/new_mainbg/학부소개_배경사진2.jpg" imageAlt="연세대학교 백양로 야경" />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부소개", path: "/about" }, { label: "연혁" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">OUR STORY</p>
            <h2 className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
              도전으로 증명한 역사,
              <br />
              미래로 나아가는 학부
            </h2>
            <p className="mt-5 text-ink/70">
              1958년 건설공학과로 첫걸음을 뗀 이후, 반세기가 넘는 시간 동안 쌓아온 도전과 성장의 기록이 오늘의
              연세대학교 기계공학부를 만들어왔습니다.
            </p>

            {/* Campus photo, soft-blended into the paper background — bleeds
                slightly past the column's left edge for an asymmetric, editorial
                feel. Hidden on mobile where the accordion follows directly. */}
            <ScrollReveal className="mt-12 hidden md:block">
              <ParallaxImage className="-ml-8 aspect-[3/4] w-[105%] lg:-ml-12" strength={26}>
                <Image
                  src="/images/subpage_image/연혁_사용.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 32vw, 0px"
                  className="object-cover"
                  style={{ filter: "sepia(0.14) saturate(0.92)" }}
                />
              </ParallaxImage>
            </ScrollReveal>
          </div>

          <div>
            <HistoryAccordion entries={history} lang="ko" />
          </div>
        </div>
      </section>
    </>
  );
}
