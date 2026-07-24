import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { BOARD_DATA, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BOARD_DATA.news.map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BOARD_DATA.news.find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "News" };
}

export default async function NewsArticleDetailPageEn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = BOARD_DATA.news.find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = getAdjacent("news", id);

  return (
    <PostDetail
      post={post}
      lang="en"
      backHref={listHref("en", "news")}
      prev={prev ? { href: postHref("en", "news", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("en", "news", next.sourcePostId), title: next.title } : null}
    />
  );
}
