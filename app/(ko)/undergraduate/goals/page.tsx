import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { UNDERGRADUATE_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "교육 목표" };

const GOALS = [
  "창의적 사고방법과 설계기술을 익히고, 기계공학을 기반으로 여러 전문 분야에 걸친 종합적인 공학설계에 적용할 수 있는 공학실무능력, 연구수행능력을 계발한다.",
  "자신의 생각을 효율적으로 전달하고 동료들과 팀워크를 할 수 있으며, 조직을 관리하고 경영할 줄 아는 리더십을 배양한다.",
  "미래에 필요한 예측하기 어려운 기술에 도전하고 신기술을 개발하여 새로운 환경에 유익하게 적용할 수 있는 능력 계발한다.",
  "평생을 통해 자기계발을 할 줄 알며, 개방적인 마음과 비판적 의문을 가지고 자신의 연구결과 및 개발품에 대해 사회적, 윤리적 책임을 인식할 줄 아는 소양을 익힌다.",
  "글로벌사회에서 공학인의 국제적 역할을 인식하고 산업체, 교육·연구기관, 공공기관의 리더로서 성장할 수 있는 역량을 계발한다.",
];

export default function GoalsPage() {
  return (
    <>
      <PageHero eyebrow="UNDERGRADUATE" title="교육 목표" image="/images/new_mainbg/학부_배경사진.jpg" imageAlt="연세대학교 언더우드관" />
      <SectionSubNav items={UNDERGRADUATE_NAV} lang="ko" label="학부 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부", path: "/undergraduate" }, { label: "교육 목표" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div>
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">교육목적</p>
          <p className="mt-3 max-w-2xl text-balance font-display text-xl text-ink sm:text-2xl">
            창의적 사고와 도전정신을 바탕으로 종합 설계 능력을 갖추고 글로벌 사회에 유익한 가치를 창출할 수 있는 인재
            양성
          </p>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-lg text-ink">기계공학 프로그램의 세부교육</h2>
          <ol className="mt-6 space-y-6">
            {GOALS.map((g, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm text-primary">
                  {i + 1}
                </span>
                <p className="pt-1 text-ink/80">{g}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
