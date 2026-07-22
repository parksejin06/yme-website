import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ScrollReveal from "@/components/ScrollReveal";
import { RESEARCH_FIELDS, FIELD_DESCRIPTIONS, fieldLabel } from "@/lib/labs";
import { LABS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "연구분야 소개" };

export default function LabsFieldsPage() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="연구분야 소개"
        description="연세대학교 기계공학부의 6개 연구분야를 소개합니다. 관심 있는 분야를 클릭하면 소속 연구실 목록으로 이동합니다."
      />
      <SectionSubNav items={LABS_NAV} lang="ko" label="연구실 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "연구실", path: "/labs" }, { label: "연구분야 소개" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_FIELDS.map((field, i) => (
            <ScrollReveal key={field.key} delayMs={i * 90}>
              <Link
                href={`/labs?field=${encodeURIComponent(field.key)}`}
                className="group block overflow-hidden border border-line transition-colors hover:border-primary"
              >
                <div className="relative h-52 w-full overflow-hidden sm:h-60">
                  <Image
                    src={field.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="font-display text-xl font-bold text-ink">{fieldLabel(field.key, "ko")}</p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">{FIELD_DESCRIPTIONS[field.key]?.ko}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    소속 연구실 보기 →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
