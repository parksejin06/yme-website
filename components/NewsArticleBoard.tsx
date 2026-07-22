"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { postHref } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { all: "전체", search: "제목, 내용으로 검색", noResults: "검색 결과가 없습니다." },
  en: { all: "All", search: "Search by title or content", noResults: "No results found." },
};

function yearOf(publishedAt: string | null): string | null {
  if (!publishedAt) return null;
  const m = publishedAt.match(/^(\d{4})/);
  return m ? m[1] : null;
}

function ArticleThumb({ post }: { post: CommunityPost }) {
  const img = post.contentImages[0];
  const src = img?.localPath || img?.sourceUrl;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-primary/40">
      <Newspaper className="h-7 w-7" aria-hidden="true" />
    </div>
  );
}

export default function NewsArticleBoard({ lang, articles }: { lang: Lang; articles: CommunityPost[] }) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => {
    const s = new Set<string>();
    for (const a of articles) {
      const y = yearOf(a.publishedAt);
      if (y) s.add(y);
    }
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (year !== "all" && yearOf(a.publishedAt) !== year) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.plainText.toLowerCase().includes(q);
    });
  }, [articles, query, year]);

  const [featured, ...rest] = filtered;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setYear("all")}
            className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium ${
              year === "all" ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft"
            }`}
          >
            {t.all}
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium ${
                year === y ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="min-h-11 w-full rounded-full border border-line bg-white pl-10 pr-3 text-[15px] outline-none focus:border-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-8">
          {featured && (
            <Link
              href={postHref(lang, "news", featured.sourcePostId)}
              className="group grid gap-6 border border-line p-5 hover:border-primary-soft sm:grid-cols-[26rem_1fr] sm:p-8 lg:grid-cols-[32rem_1fr]"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface-muted sm:aspect-[4/3]">
                <ArticleThumb post={featured} />
              </div>
              <div className="flex flex-col justify-center">
                <p
                  className="text-balance font-display font-bold text-ink group-hover:text-primary"
                  style={{ fontSize: "clamp(1.375rem, 1.6vw, 2.125rem)", lineHeight: 1.3 }}
                >
                  {featured.title}
                </p>
                <p className="mt-3 line-clamp-2 text-base text-ink/60">{featured.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/45">
                  {featured.author && <span>{featured.author}</span>}
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{featured.publishedAt}</span>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <ul className="mt-8 grid gap-x-8 gap-y-0 divide-y divide-line border-y border-line sm:grid-cols-2 sm:gap-y-0 sm:divide-y-0 lg:grid-cols-3">
              {rest.map((a) => (
                <li key={a.id} className="sm:border-b sm:border-line">
                  <Link href={postHref(lang, "news", a.sourcePostId)} className="group flex items-center gap-4 py-5 sm:items-start sm:gap-0 sm:py-0">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:hidden">
                      <ArticleThumb post={a} />
                    </div>
                    <div className="hidden aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-muted sm:block">
                      <ArticleThumb post={a} />
                    </div>
                    <div className="min-w-0 flex-1 sm:mt-4 sm:pb-6">
                      <p className="text-balance text-[17px] font-medium text-ink group-hover:text-primary sm:text-lg">{a.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/50">
                        {a.author && <span>{a.author}</span>}
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>{a.publishedAt}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
