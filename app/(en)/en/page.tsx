import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import StatCounter from "@/components/StatCounter";
import SocialSection from "@/components/home/SocialSection";
import LatestUpdatesSection from "@/components/home/LatestUpdatesSection";
import history from "@/data/history.json";
import labs from "@/data/labs.json";

const foundingYear = 1962;
const currentYear = new Date().getFullYear();

export default function HomePageEn() {
  const recentHistory = history.slice(-5).reverse();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
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
              "linear-gradient(to bottom, rgba(15,42,87,0.4) 0%, rgba(15,42,87,0.45) 55%, rgba(15,42,87,0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.14) 55%, transparent 78%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-content px-4 py-28 text-center sm:px-6">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl md:text-7xl">
            <span className="block">YONSEI UNIVERSITY</span>
            <span className="mt-1 block text-[0.73em] sm:mt-2 md:mt-3">MECHANICAL ENGINEERING</span>
          </h1>
          <p className="mt-6 text-balance font-body text-base text-white/90 sm:text-lg">
            Relentless challenge, creating value for the world.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/en/about"
              className="rounded-full bg-white px-6 py-3 text-sm font-body text-primary transition-colors hover:bg-white/90"
            >
              About the School
            </Link>
            <Link
              href="/en/labs"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-body text-white transition-colors hover:bg-white/10"
            >
              Explore Research Labs
            </Link>
          </div>
        </div>

        <a
          href="#vision-teaser"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/90 drop-shadow-md transition-colors hover:text-white sm:bottom-10"
        >
          <span className="font-body text-xs font-medium tracking-[0.2em]">Scroll to Explore</span>
          <ChevronDown className="h-5 w-5 animate-soft-bounce" aria-hidden="true" />
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
              className="h-auto w-full rounded-lg object-cover"
            />
          </ScrollSlideIn>
          <ScrollReveal delayMs={120}>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">SINCE {foundingYear}</p>
            <h2 className="mt-4 text-balance font-display text-2xl text-ink sm:text-3xl">
              {currentYear - foundingYear} years of relentless challenge
            </h2>
            <p className="mt-5 text-ink/70">
              Since its founding as the Department of Mechanical Engineering in 1962, Yonsei University&apos;s
              School of Mechanical Engineering has continually pushed the boundaries of industry and academia —
              from precision machinery to robotics, nanotechnology, and energy systems — creating value for the
              world through research every day.
            </p>
            <Link
              href="/en/about"
              className="mt-6 inline-block border-b border-primary text-sm font-body text-primary"
            >
              View full history →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-14 sm:py-16">
        <ScrollReveal className="mx-auto grid max-w-content grid-cols-2 divide-y divide-white/15 px-4 sm:px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          <div className="py-5 pr-6 md:py-0 md:pr-8">
            <StatCounter value={currentYear - foundingYear} suffix="th" label="Years since founding" />
          </div>
          <div className="py-5 pl-6 md:py-0 md:px-8">
            <StatCounter value={labs.length} label="Research labs" />
          </div>
          <div className="py-5 pr-6 md:py-0 md:px-8">
            <StatCounter value={6} label="Research fields" />
          </div>
          <div className="py-5 pl-6 md:py-0 md:pl-8">
            <StatCounter value={10} label="Industry-Academia Partnerships" />
          </div>
        </ScrollReveal>
      </section>

      <LatestUpdatesSection lang="en" />

      {/* History teaser */}
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-balance font-display text-2xl text-ink sm:text-3xl">Recent History</h2>
          </ScrollReveal>
          <ol className="mt-10 space-y-0 border-l border-line pl-8">
            {recentHistory.map((h, i) => (
              <ScrollReveal key={h.year + h.month} delayMs={i * 70}>
                <li className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                  <p className="font-display text-sm text-primary">
                    {h.year}.{h.month}
                  </p>
                  <p className="mt-1 text-ink/80">{h.en}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
          <Link href="/en/about" className="mt-4 inline-block border-b border-primary text-sm font-body text-primary">
            View full history →
          </Link>
        </div>
      </section>

      <SocialSection lang="en" />
    </>
  );
}
