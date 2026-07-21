import Link from "next/link";
import { Newspaper, Pin } from "lucide-react";
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
    return <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-primary/30">
      <Newspaper className="h-8 w-8" aria-hidden="true" />
    </div>
  );
}

export default function LatestUpdatesSection({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  const latestNews = sortByDateDesc(BOARD_DATA.news).slice(0, 3);

  const noticeSource = BOARD_DATA["notices-undergraduate"];
  const pinnedNotices = sortByDateDesc(noticeSource.filter((n) => n.isPinned));
  const restNotices = sortByDateDesc(noticeSource.filter((n) => !n.isPinned));
  const latestNotices = [...pinnedNotices, ...restNotices].slice(0, 4);

  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">{t.eyebrow}</p>
        <h2 className="mt-3 text-balance font-display text-2xl text-ink sm:text-3xl">{t.title}</h2>
      </ScrollReveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        {/* News */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">{t.newsHeading}</h3>
            <Link href={lang === "ko" ? "/news/research" : "/en/news/research"} className="text-sm font-body text-primary">
              {t.newsMore} →
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {latestNews.map((post, i) => (
              <ScrollReveal key={post.id} delayMs={i * 100}>
                <Link
                  href={postHref(lang, "news", post.sourcePostId)}
                  className="group block h-full overflow-hidden rounded-lg border border-line transition-all duration-200 hover:-translate-y-1 hover:border-primary-soft hover:shadow-md"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                    <NewsThumb post={post} />
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium text-ink group-hover:text-primary">{post.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/45">
                      {post.author && <span>{post.author}</span>}
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.publishedAt}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">{t.noticeHeading}</h3>
            <Link href={lang === "ko" ? "/news" : "/en/news"} className="text-sm font-body text-primary">
              {t.noticeMore} →
            </Link>
          </div>
          <ScrollReveal delayMs={120} className="mt-5">
            <ul className="divide-y divide-line rounded-lg border border-line">
              {latestNotices.map((n) => (
                <li key={n.id}>
                  <Link
                    href={postHref(lang, "notices-undergraduate", n.sourcePostId)}
                    className="flex items-start gap-2.5 px-4 py-3.5 transition-colors hover:bg-surface-muted"
                  >
                    {n.isPinned ? (
                      <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                        <Pin className="h-2.5 w-2.5" aria-hidden="true" />
                        {t.pinned}
                      </span>
                    ) : (
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/30" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm text-ink/85">{n.title}</span>
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
