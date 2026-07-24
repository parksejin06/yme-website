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
  return { title: post?.title ?? "Thesis Review" };
}

export default async function ThesisReviewDetailPageEn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getBoard("thesis-reviews")).find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = await getAdjacent("thesis-reviews", id);

  return (
    <PostDetail
      post={post}
      lang="en"
      backHref={listHref("en", "thesis-reviews")}
      prev={prev ? { href: postHref("en", "thesis-reviews", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("en", "thesis-reviews", next.sourcePostId), title: next.title } : null}
    />
  );
}
