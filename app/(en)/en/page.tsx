import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import StatCounter from "@/components/StatCounter";
import HistoryAccordion from "@/components/HistoryAccordion";
import SocialSection from "@/components/home/SocialSection";
import LatestUpdatesSection from "@/components/home/LatestUpdatesSection";
import history from "@/data/history.json";
import labs from "@/data/labs.json";

const foundingYear = 1962;
const currentYear = new Date().getFullYear();

export default function HomePageEn() {
  const recentHistory = history.slice(-5);

  return (
    <>
      {/* Hero — asymmetric, bottom-left anchored editorial composition */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        <Image
          src="/images/main-bg.png"
          alt="Aerial view of Yonsei University's Sinchon campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,29,64,0.5) 0%, rgba(8,29,64,0.18) 30%, rgba(8,29,64,0.32) 62%, rgba(8,29,64,0.78) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-content px-[var(--page-gutter)] pb-24 pt-40 sm:pb-28">
          <div className="max-w-3xl">
            <p className="font-body text-xs font-medium tracking-[0.3em] text-white/70 sm:text-sm">
              YONSEI UNIVERSITY · SINCE {foundingYear}
            </p>
            <h1 className="mt-5 font-display leading-[1.08] text-white" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}>
              MECHANICAL
              <br />
              ENGINEERING
            </h1>
            <p className="mt-7 max-w-md border-l border-white/40 pl-5 font-body text-base leading-relaxed text-white/85 sm:text-lg">
              Relentless challenge,
              <br />
              creating value for the world.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Link href="/en/about" className="link-rule font-body text-sm tracking-wide text-white">
                About the School <span aria-hidden="true">→</span>
              </Link>
              <Link href="/en/labs" className="link-rule font-body text-sm tracking-wide text-white">
                Explore Research Labs <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Vertical editorial caption, bottom-right */}
        <p
          className="absolute bottom-24 right-6 z-10 hidden font-body text-[11px] tracking-[0.35em] text-white/50 md:block lg:right-10"
          style={{ writingMode: "vertical-rl" }}
          aria-hidden="true"
        >
          SEOUL · SINCHON CAMPUS
        </p>

        <a
          href="#vision-teaser"
          className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-white/80 transition-colors hover:text-white md:flex lg:right-10"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-4 w-4 animate-soft-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* Vision teaser */}
      <section id="vision-teaser" className="mx-auto max-w-content overflow-x-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <ScrollSlideIn>
            <Image
              src="/images/home_image_2.jpg"
              alt="Students studying in the Yonsei University College of Engineering lounge"
              width={640}
              height={800}
              className="h-auto w-full object-cover"
            />
          </ScrollSlideIn>
          <ScrollReveal delayMs={120}>
            <p className="font-body text-xs font-medium tracking-[0.25em] text-accent">SINCE {foundingYear}</p>
            <h2 className="mt-5 text-balance font-display text-[1.75rem] leading-snug text-ink sm:text-4xl">
              {currentYear - foundingYear} years of relentless challenge
            </h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              Since its founding as the Department of Mechanical Engineering in 1962, Yonsei University&apos;s
              School of Mechanical Engineering has continually pushed the boundaries of industry and academia —
              from precision machinery to robotics, nanotechnology, and energy systems — creating value for the
              world through research every day.
            </p>
            <Link href="/en/about" className="link-rule mt-8 inline-block text-sm font-body text-primary">
              View full history <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats — inverted navy ledger band: hairline-divided figures, no icons */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-content px-[var(--page-gutter)]">
          <div className="grid grid-cols-2 gap-y-10 border-t border-white/15 pt-10 md:grid-cols-4 md:divide-x md:divide-white/15 md:gap-y-0">
            <div className="md:pr-10">
              <StatCounter value={currentYear - foundingYear} suffix="th" label="Years since founding" />
            </div>
            <div className="md:px-10">
              <StatCounter value={labs.length} label="Research labs" />
            </div>
            <div className="md:px-10">
              <StatCounter value={6} label="Research fields" />
            </div>
            <div className="md:pl-10">
              <StatCounter value={10} label="Industry-Academia Partnerships" />
            </div>
          </div>
        </div>
      </section>

      <LatestUpdatesSection lang="en" />

      {/* History teaser */}
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <ScrollReveal>
              <p className="font-body text-xs font-medium tracking-[0.25em] text-accent">HISTORY</p>
              <h2 className="mt-5 text-balance font-display text-[1.75rem] leading-snug text-ink sm:text-4xl">
                A History Proven Through Challenge,
                <br />
                A School Moving Forward
              </h2>
              <p className="mt-6 leading-relaxed text-ink/70">
                Since taking its first steps as the Department of Construction Engineering in 1958, more than six
                decades of challenge and growth have shaped what is now Yonsei University&apos;s School of Mechanical
                Engineering.
              </p>
            </ScrollReveal>

            <div>
              <HistoryAccordion entries={recentHistory} lang="en" />
              <Link href="/en/about/history" className="link-rule mt-8 inline-block text-sm font-body text-primary">
                View full history <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SocialSection lang="en" />
    </>
  );
}
