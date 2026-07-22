import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, ExternalLink, Pin } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";
import PostAttachments from "./PostAttachments";

const COPY = {
  ko: { back: "목록으로", prev: "이전 글", next: "다음 글", pinned: "공지", original: "공식 원문 보기" },
  en: { back: "Back to list", prev: "Previous", next: "Next", pinned: "Notice", original: "View official original" },
};

/**
 * originalHtml is already sanitized once at import time (scripts/lib/yonsei-board.mjs, sanitize-html)
 * against a fixed allow-list of tags/attributes -- it is static build-time content, not user input,
 * so rendering it here does not need a second client-side sanitizer pass.
 */
export default function PostDetail({
  post,
  lang,
  backHref,
  prev,
  next,
}: {
  post: CommunityPost;
  lang: Lang;
  backHref: string;
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
}) {
  const t = COPY[lang];

  return (
    <article className="mx-auto max-w-reading px-[var(--page-gutter)] pb-14 pt-[calc(var(--utility-bar-h)+6.5rem)] sm:pb-20 sm:pt-[calc(var(--utility-bar-h)+8rem)]">
      <div className="mb-5 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary/80">
        <span>{post.category}</span>
        {post.isPinned && (
          <span className="inline-flex items-center gap-1 rounded bg-accent/15 px-1.5 py-0.5 text-accent">
            <Pin className="h-3 w-3" /> {t.pinned}
          </span>
        )}
      </div>

      <h1
        className="text-balance font-display font-bold leading-snug text-ink"
        style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
      >
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line pb-6 text-[15px] text-ink/55">
        {post.author && <span>{post.author}</span>}
        {post.publishedAt && (
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.publishedAt}</span>
        )}
      </div>

      {post.originalHtml ? (
        <div className="community-body mt-8" dangerouslySetInnerHTML={{ __html: post.originalHtml }} />
      ) : null}

      <PostAttachments attachments={post.attachments} lang={lang} />

      <div className="mt-8">
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-ink/40 hover:text-ink/70"
        >
          {t.original} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-12 divide-y divide-line border-y border-line">
        {next && (
          <Link href={next.href} className="flex items-center gap-3 py-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4 shrink-0 text-ink/40" />
            <span className="shrink-0 text-sm text-ink/40">{t.next}</span>
            <span className="truncate text-[15px]">{next.title}</span>
          </Link>
        )}
        {prev && (
          <Link href={prev.href} className="flex items-center gap-3 py-4 hover:text-primary">
            <ChevronRight className="h-4 w-4 shrink-0 text-ink/40" />
            <span className="shrink-0 text-sm text-ink/40">{t.prev}</span>
            <span className="truncate text-[15px]">{prev.title}</span>
          </Link>
        )}
      </div>

      <Link href={backHref} className="mt-8 inline-flex items-center gap-1.5 text-[15px] text-ink/60 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>
    </article>
  );
}
