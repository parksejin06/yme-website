import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { getBoard, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getBoard("thesis-reviews")).map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = (await getBoard("thesis-reviews")).find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "학위논문심사" };
}

export default async function ThesisReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getBoard("thesis-reviews")).find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = await getAdjacent("thesis-reviews", id);

  return (
    <PostDetail
      post={post}
      lang="ko"
      backHref={listHref("ko", "thesis-reviews")}
      prev={prev ? { href: postHref("ko", "thesis-reviews", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("ko", "thesis-reviews", next.sourcePostId), title: next.title } : null}
    />
  );
}
