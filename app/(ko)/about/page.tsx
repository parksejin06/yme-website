import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import ScrollReveal from "@/components/ScrollReveal";
import { ABOUT_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "학부 개요" };

const QUICK_LINKS = [
  { path: "/about/vision", title: "비전·교육목표", desc: "기계공학부가 추구하는 비전과 교육목표를 확인합니다." },
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
        image="/images/eagle-statue.jpg"
        imageAlt="연세대학교 독수리상과 'YONSEI, where we make history' 사이니지"
        imagePosition="center 30%"
      />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
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
        </ScrollReveal>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">학부소개 바로가기</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
