import Link from "next/link";
import { Newspaper } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { BOARD_DATA } from "@/lib/community-data";
import { postHref } from "@/lib/community-content";
import type { CommunityPost } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    eyebrow: "ON THE RADAR",
    title: "최신 소식",
    newsHeading: "뉴스",
    newsMore: "뉴스 전체보기",
    noticeHeading: "공지사항",
    noticeMore: "공지사항 전체보기",
    pinned: "공지",
  },
  en: {
    eyebrow: "ON THE RADAR",
    title: "Latest Updates",
    newsHeading: "News",
    newsMore: "View all news",
    noticeHeading: "Notices",
    noticeMore: "View all notices",
    pinned: "Notice",
  },
};

function sortByDateDesc(posts: CommunityPost[]): CommunityPost[] {
  return [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

function NewsThumb({ post }: { post: CommunityPost }) {
  const img = post.contentImages[0];
  const src = img?.localPath || img?.sourceUrl;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-85"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-primary/25">
      <Newspaper className="h-8 w-8" aria-hidden="true" />
    </div>
  );
}

export default function LatestUpdatesSection({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  const latestNews = sortByDateDesc(BOARD_DATA.news).slice(0, 3);
  const [leadNews, ...restNews] = latestNews;

  const noticeSource = BOARD_DATA["notices-undergraduate"];
  const pinnedNotices = sortByDateDesc(noticeSource.filter((n) => n.isPinned));
  const restNotices = sortByDateDesc(noticeSource.filter((n) => !n.isPinned));
  const latestNotices = [...pinnedNotices, ...restNotices].slice(0, 4);

  return (
    <section className="mx-auto max-w-content px-[var(--page-gutter)] py-20 sm:py-28">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/20 pb-6">
          <div>
            <p className="font-body text-xs font-medium tracking-[0.25em] text-accent">{t.eyebrow}</p>
            <h2 className="mt-3 font-display text-[1.75rem] text-ink sm:text-4xl">{t.title}</h2>
          </div>
          <Link
            href={lang === "ko" ? "/news/research" : "/en/news/research"}
            className="link-rule mb-1 text-sm font-body text-primary"
          >
            {t.newsMore} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
        {/* News: one lead story + two secondary rows, newspaper style */}
        <div className="grid gap-8 sm:grid-cols-[1.25fr_1fr] sm:gap-10">
          {leadNews && (
            <ScrollReveal>
              <Link href={postHref(lang, "news", leadNews.sourcePostId)} className="group block">
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                  <NewsThumb post={leadNews} />
                </div>
                <p className="mt-5 line-clamp-3 font-display text-xl leading-snug text-ink transition-colors group-hover:text-primary sm:text-2xl">
                  {leadNews.title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/45">
                  {leadNews.author && <span>{leadNews.author}</span>}
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{leadNews.publishedAt}</span>
                </div>
              </Link>
            </ScrollReveal>
          )}

          <div className="flex flex-col divide-y divide-line">
            {restNews.map((post, i) => (
              <ScrollReveal key={post.id} delayMs={(i + 1) * 90} className="flex-1 py-6 first:pt-0 last:pb-0">
                <Link href={postHref(lang, "news", post.sourcePostId)} className="group flex gap-4">
                  <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden bg-surface-muted sm:w-32">
                    <NewsThumb post={post} />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-3 text-sm font-medium leading-snug text-ink transition-colors group-hover:text-primary">
                      {post.title}
                    </p>
                    <p className="mt-2 text-xs text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {post.publishedAt}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Notices: rule-divided editorial list, no card box */}
        <div>
          <div className="flex items-baseline justify-between border-t-2 border-primary pt-4">
            <h3 className="font-display text-lg text-ink">{t.noticeHeading}</h3>
            <Link href={lang === "ko" ? "/news" : "/en/news"} className="link-rule text-sm font-body text-primary">
              {t.noticeMore} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ScrollReveal delayMs={120} className="mt-2">
            <ul className="divide-y divide-line">
              {latestNotices.map((n) => (
                <li key={n.id}>
                  <Link
                    href={postHref(lang, "notices-undergraduate", n.sourcePostId)}
                    className="group flex items-start gap-3 py-4"
                  >
                    {n.isPinned && (
                      <span className="mt-0.5 shrink-0 border border-accent/50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent">
                        {t.pinned}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm text-ink/85 transition-colors group-hover:text-primary">
                        {n.title}
                      </span>
                      <span className="mt-1 block text-xs text-ink/45" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {n.publishedAt}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
