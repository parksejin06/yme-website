import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import SectionSubNav from "@/components/SectionSubNav";
import { HomeIcon, ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";
import { NEWS_NAV } from "@/lib/nav";
import notices from "@/data/notices.json";

interface Notice {
  id: number;
  isNotice: boolean;
  title: string;
  author: string;
  date: string;
  content: string;
  hasAttachment: boolean;
}

const list = notices as Notice[];

export function generateStaticParams() {
  return list.map((n) => ({ id: String(n.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const notice = list.find((n) => n.id === Number(id));
  return { title: notice ? notice.title : "공지사항" };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = list.find((n) => n.id === Number(id));
  if (!notice) notFound();

  return (
    <>
      <SectionSubNav items={NEWS_NAV} lang="ko" label="공지사항 서브 내비게이션" />
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <nav aria-label="브레드크럼" className="flex items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="flex items-center hover:text-white" aria-label="홈">
              <HomeIcon className="h-4 w-4" />
            </Link>
            <ChevronRightIcon />
            <Link href="/news" className="hover:text-white">
              공지사항
            </Link>
            <ChevronRightIcon />
            <span className="truncate text-white">{notice.title}</span>
          </nav>
          <div className="mt-6 flex items-center gap-2">
            {notice.isNotice && (
              <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">공지</span>
            )}
            <h1 className="text-balance font-display text-2xl text-white sm:text-4xl">{notice.title}</h1>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
            <span>{notice.author}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{notice.date}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <ScrollReveal>
          {notice.hasAttachment && (
            <p className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink/60">
              첨부파일 있음
            </p>
          )}
          <p className="whitespace-pre-line text-base leading-relaxed text-ink/80">{notice.content}</p>
        </ScrollReveal>

        <Link href="/news" className="mt-14 inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-primary">
          <ArrowLeftIcon /> 목록으로
        </Link>
      </section>
    </>
  );
}
