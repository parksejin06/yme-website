import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import history from "@/data/history.json";

export const metadata: Metadata = { title: "About · History · Vision" };

export default function AboutPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="About · History · Vision"
        image="/images/eagle-statue.jpg"
        imageAlt="Yonsei University's eagle statue with the 'YONSEI, where we make history' signage"
        imagePosition="center 30%"
      />

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">VISION</p>
          <blockquote className="mt-4 text-balance font-display text-2xl leading-snug text-ink sm:text-4xl">
            &ldquo;Relentless challenge,
            <br />
            creating value for the world.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-2xl text-ink/70">
            Since its founding in 1962, Yonsei University&apos;s School of Mechanical Engineering has led
            mechanical engineering education and research in Korea for over 60 years. Across a wide range of
            fields — precision & design, thermofluids, robotics & mechatronics, materials & structures,
            nano/bio, and energy — 26 research laboratories continue active research, with the goal of
            cultivating talent who contribute to industry.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface-muted py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">History</h2>
          </ScrollReveal>
          <ol className="mt-12 space-y-0 border-l border-line pl-8">
            {history.map((h, i) => (
              <ScrollReveal key={h.year + h.month} delayMs={Math.min(i * 40, 400)}>
                <li className="relative pb-9 last:pb-0">
                  <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                  <p className="font-display text-sm text-primary">
                    {h.year}.{h.month}
                  </p>
                  <p className="mt-1 text-ink/80">{h.en}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
