import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { UNDERGRADUATE_NAV } from "@/lib/nav";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = { title: "학부 개요" };

const QUICK_LINKS = [
  { path: "/undergraduate/goals", title: "교육 목표", desc: "기계공학부가 추구하는 인재상과 세부 교육 목표를 확인합니다." },
  { path: "/undergraduate/graduation", title: "졸업 요건", desc: "학번을 선택해 나에게 해당하는 졸업 이수 요건을 확인합니다." },
  { path: "/undergraduate/courses", title: "교과목 소개", desc: "학년·학기별로 개설되는 전공·교양 교과목을 탐색합니다." },
  { path: "/undergraduate/curriculum-map", title: "교과목 체계도", desc: "1학년부터 4학년까지 이어지는 교과목 흐름을 한눈에 봅니다." },
];

export default function UndergraduatePage() {
  return (
    <>
      <PageHero
        eyebrow="UNDERGRADUATE"
        title="학부 개요"
        description="연세대학교 기계공학부 학부 과정은 창의적 사고와 종합 설계 능력을 갖춘 인재를 기릅니다."
        image="/images/engine-exploded.jpg"
        imageAlt="기계공학부 학부 실습 장면"
      />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">MISSION</p>
        <blockquote className="mt-4 max-w-3xl text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;창의적 사고와 도전정신을 바탕으로 종합 설계 능력을 갖추고 글로벌 사회에 유익한 가치를 창출할 수 있는
          인재 양성&rdquo;
        </blockquote>
        <p className="mt-5 max-w-2xl text-ink/70">
          기계공학부 학부 과정은 1학년 기초과학·수학 교육을 시작으로, 2학년부터는 고체역학·열역학·유체역학·동역학 등
          전공핵심 교과목을, 3·4학년에는 응용·심화 전공선택 교과목과 종합설계·연구 교과목을 이수하도록 설계되어
          있습니다. 아래에서 교육 목표, 졸업 요건, 교과목 소개, 교과목 체계도를 확인할 수 있습니다.
        </p>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="font-display text-xl text-ink">학부 바로가기</h2>
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
