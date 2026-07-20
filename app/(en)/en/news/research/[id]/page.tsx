import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionSubNav from "@/components/SectionSubNav";
import { HomeIcon, ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";
import { NEWS_NAV } from "@/lib/nav";
import articles from "@/data/news-articles.json";
import type { NewsArticle } from "@/components/NewsArticleBoard";

const list = articles as NewsArticle[];

export function generateStaticParams() {
  return list.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = list.find((a) => a.id === Number(id));
  return { title: article ? article.title : "News" };
}

export default async function NewsArticleDetailPageEn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = list.find((a) => a.id === Number(id));
  if (!article) notFound();

  return (
    <>
      <SectionSubNav items={NEWS_NAV} lang="en" label="News sub-navigation" />
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/70">
            <Link href="/en" className="flex items-center hover:text-white" aria-label="Home">
              <HomeIcon className="h-4 w-4" />
            </Link>
            <ChevronRightIcon />
            <Link href="/en/news/research" className="hover:text-white">
              Research News
            </Link>
            <ChevronRightIcon />
            <span className="truncate text-white">{article.title}</span>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <Newspaper className="h-6 w-6 shrink-0 text-white/70" aria-hidden="true" />
            <h1 className="text-balance font-display text-2xl text-white sm:text-4xl">{article.title}</h1>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span>{article.author}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{article.date}</span>
            {article.journal && <span>Published in {article.journal}</span>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <ScrollReveal>
          <p className="whitespace-pre-line text-base leading-relaxed text-ink/80">{article.content}</p>
        </ScrollReveal>

        <Link
          href="/en/news/research"
          className="mt-14 inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-primary"
        >
          <ArrowLeftIcon /> Back to list
        </Link>
      </section>
    </>
  );
}
