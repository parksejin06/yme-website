import InstagramFeed from "@/components/home/InstagramFeed";
import YouTubeFeature from "@/components/home/YouTubeFeature";
import instagramAccounts from "@/data/social-instagram.json";
import youtubeData from "@/data/social-youtube.json";
import type { InstagramAccount, YouTubeData } from "@/lib/social";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    eyebrow: "YONSEI ME NOW",
    title: "연구실 밖에서도 계속되는\n연세 기계공학부의 이야기.",
    subline: "Research · Campus · Students · Community",
    navInstagram: "Instagram",
    navYoutube: "YouTube",
  },
  en: {
    eyebrow: "YONSEI ME NOW",
    title: "The story of Yonsei ME\ncontinues beyond the lab.",
    subline: "Research · Campus · Students · Community",
    navInstagram: "Instagram",
    navYoutube: "YouTube",
  },
};

export default function SocialSection({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  return (
    <section className="border-t border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-sm tracking-[0.2em] text-primary/70">{t.eyebrow}</p>
            <h2 className="mt-4 whitespace-pre-line text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
              {t.title}
            </h2>
            <p className="mt-3 text-sm text-ink/45">{t.subline}</p>
          </div>
          <div className="flex gap-2">
            <a
              href="#social-instagram"
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-primary hover:text-primary"
            >
              {t.navInstagram}
            </a>
            <a
              href="#social-youtube"
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-primary hover:text-primary"
            >
              {t.navYoutube}
            </a>
          </div>
        </div>

        <div id="social-instagram" className="mt-16 scroll-mt-24">
          <InstagramFeed accounts={instagramAccounts as InstagramAccount[]} lang={lang} />
        </div>

        <div id="social-youtube" className="mt-16 scroll-mt-24 border-t border-line pt-16">
          <YouTubeFeature data={youtubeData as YouTubeData} lang={lang} />
        </div>
      </div>
    </section>
  );
}
