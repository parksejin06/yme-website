import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { BOARD_DATA, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BOARD_DATA["seminars"].map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BOARD_DATA["seminars"].find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "Seminars" };
}

export default async function SeminarsDetailPageEn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = BOARD_DATA["seminars"].find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = getAdjacent("seminars", id);

  return (
    <PostDetail
      post={post}
      lang="en"
      backHref={listHref("en", "seminars")}
      prev={prev ? { href: postHref("en", "seminars", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("en", "seminars", next.sourcePostId), title: next.title } : null}
    />
  );
}
