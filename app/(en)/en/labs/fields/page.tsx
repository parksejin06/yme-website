import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import ScrollReveal from "@/components/ScrollReveal";
import { RESEARCH_FIELDS, FIELD_DESCRIPTIONS, fieldLabel } from "@/lib/labs";
import { LABS_NAV } from "@/lib/nav";

export const metadata: Metadata = { title: "Research Fields" };

export default function LabsFieldsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="Research Fields"
        description="An overview of the 6 research fields at Yonsei University's School of Mechanical Engineering. Click a field to see its research labs."
        image="/images/new_mainbg/연구실_배경사진.jpg"
        imageAlt="Yonsei University's eagle statue at night" imagePosition="center 88%"
      />
      <SectionSubNav items={LABS_NAV} lang="en" label="Research Labs sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Research Labs", path: "/labs" }, { label: "Research Fields" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_FIELDS.map((field, i) => (
            <ScrollReveal key={field.key} delayMs={i * 90}>
              <Link
                href={`/en/labs?field=${encodeURIComponent(field.key)}`}
                className="group block overflow-hidden border border-line transition-colors hover:border-primary"
              >
                <div className="relative h-52 w-full overflow-hidden sm:h-60">
                  <Image
                    src={field.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-85"
                  />
                </div>
                <div className="p-6">
                  <p className="font-display text-xl font-bold text-ink">{fieldLabel(field.key, "en")}</p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">{FIELD_DESCRIPTIONS[field.key]?.en}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View labs →
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
