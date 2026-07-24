import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { getBoard, getAdjacent } from "@/lib/community-data";
import { postHref, listHref } from "@/lib/community-content";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getBoard("jobs")).map((p) => ({ id: p.sourcePostId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = (await getBoard("jobs")).find((p) => p.sourcePostId === id);
  return { title: post?.title ?? "Jobs & Internships" };
}

export default async function AdmissionsJobsDetailPageEn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getBoard("jobs")).find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = await getAdjacent("jobs", id);

  return (
    <PostDetail
      post={post}
      lang="en"
      backHref={listHref("en", "jobs")}
      prev={prev ? { href: postHref("en", "jobs", prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("en", "jobs", next.sourcePostId), title: next.title } : null}
    />
  );
}
