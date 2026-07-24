import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { getBoard, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getBoard("events")).map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = (await getBoard("events")).find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "행사" };
}

export default async function EventsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getBoard("events")).find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = await getAdjacent("events", id);

  return (
    <PostDetail
      post={post}
      lang="ko"
      backHref={listHref("ko", "events")}
      prev={prev ? { href: postHref("ko", "events", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("ko", "events", next.sourcePostId), title: next.title } : null}
    />
  );
}
