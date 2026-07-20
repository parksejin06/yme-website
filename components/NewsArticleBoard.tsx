import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { Lang } from "@/lib/nav";

export interface NewsArticle {
  id: number;
  title: string;
  author: string;
  date: string;
  journal: string | null;
  content: string;
}

const COPY = {
  ko: { journal: "게재" },
  en: { journal: "Published in" },
};

export default function NewsArticleBoard({ lang, articles }: { lang: Lang; articles: NewsArticle[] }) {
  const t = COPY[lang];

  return (
    <ul className="divide-y divide-line border-y border-line">
      {articles.map((a) => (
        <li key={a.id}>
          <Link
            href={lang === "ko" ? `/news/research/${a.id}` : `/en/news/research/${a.id}`}
            className="group flex items-center gap-4 py-4 sm:gap-5 sm:py-5"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary/40 sm:h-20 sm:w-20">
              <Newspaper className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-balance text-sm font-medium text-ink group-hover:text-primary sm:text-base">
                {a.title}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                <span>{a.author}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{a.date}</span>
                {a.journal && (
                  <span className="text-primary/70">
                    {t.journal} {a.journal}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
