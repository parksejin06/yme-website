import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import history from "@/data/history.json";

export const metadata: Metadata = { title: "학부소개·연혁·비전" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="학부소개·연혁·비전"
        image="/images/eagle-statue.jpg"
        imageAlt="연세대학교 독수리상과 'YONSEI, where we make history' 사이니지"
        imagePosition="center 30%"
      />

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">VISION</p>
          <blockquote className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-4xl">
            &ldquo;멈추지 않는 도전으로
            <br />
            세상에 유익한 가치를 만듭니다.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-2xl text-ink/70">
            연세대학교 기계공학부는 1962년 설립 이래 60여 년간 대한민국 기계공학 교육과 연구를 선도해 왔습니다.
            정밀·설계, 열유체, 로봇·메카트로닉스, 재료·구조, 나노·바이오, 에너지 등 폭넓은 연구분야에서 26개
            연구실이 활발히 연구를 이어가고 있으며, 산업 현장에 기여하는 인재 양성을 목표로 합니다.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface-muted py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">연혁</h2>
          </ScrollReveal>
          <ol className="mt-12 space-y-0 border-l border-line pl-8">
            {history.map((h, i) => (
              <ScrollReveal key={h.year + h.month} delayMs={Math.min(i * 40, 400)}>
                <li className="relative pb-9 last:pb-0">
                  <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                  <p className="font-display text-sm text-primary">
                    {h.year}. {h.month}
                  </p>
                  <p className="mt-1 text-ink/80">{h.kr}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
