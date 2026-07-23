import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import ScrollReveal from "@/components/ScrollReveal";
import { ABOUT_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "학부 개요" };

const QUICK_LINKS = [
  { path: "/about/history", title: "연혁", desc: "1958년부터 이어온 기계공학부의 발자취입니다." },
  { path: "/about/staff", title: "교직원", desc: "학부·대학원·BK21 행정 담당자를 확인합니다." },
  { path: "/about/directions", title: "오시는 길", desc: "캠퍼스 위치와 찾아오시는 방법을 안내합니다." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="학부 개요"
        image="/images/new_mainbg/학부소개_배경사진2.jpg"
        imageAlt="연세대학교 백양로 야경"
      />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16">
            <div>
              <p className="font-body text-sm tracking-[0.2em] text-primary/70">OVERVIEW</p>
              <blockquote className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-4xl">
                &ldquo;멈추지 않는 도전으로
                <br />
                세상에 유익한 가치를 만듭니다.&rdquo;
              </blockquote>
              <p className="mt-6 max-w-2xl text-ink/70">
                연세대학교 기계공학부는 1962년 설립 이래 60여 년간 대한민국 기계공학 교육과 연구를 선도해 왔습니다.
                정밀·설계, 열유체, 로봇·메카트로닉스, 재료·구조, 나노·바이오, 에너지 등 폭넓은 연구분야에서 다수의
                연구실이 활발히 연구를 이어가고 있으며, 산업 현장에 기여하는 인재 양성을 목표로 합니다.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg">
              <Image
                src="/images/redesign_image/kirill-prikhodko-kRp5woiVDaY-unsplash.jpg"
                alt="기계 변속기 기어 트레인 단면"
                width={960}
                height={640}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

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
        </ScrollReveal>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">학부소개 바로가기</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.path}
                href={q.path}
                className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-white p-5 transition-colors hover:border-primary-soft"
              >
                <div>
                  <p className="font-display text-base text-ink">{q.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{q.desc}</p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
