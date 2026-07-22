import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { BOARD_DATA, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export function generateStaticParams() {
  return BOARD_DATA["jobs"].map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BOARD_DATA["jobs"].find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "채용정보·인턴십" };
}

export default async function AdmissionsJobsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = BOARD_DATA["jobs"].find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = getAdjacent("jobs", id);

  return (
    <PostDetail
      post={post}
      lang="ko"
      backHref={listHref("ko", "jobs")}
      prev={prev ? { href: postHref("ko", "jobs", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("ko", "jobs", next.sourcePostId), title: next.title } : null}
    />
  );
}
