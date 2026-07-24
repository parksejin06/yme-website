import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { BOARD_DATA, getAdjacent } from "@/lib/community-data";
import { postHref, listHref, type BoardKey } from "@/lib/community-content";

export const dynamic = "force-dynamic";

const BOARD_PARAM: Record<string, BoardKey> = {
  undergraduate: "notices-undergraduate",
  graduate: "notices-graduate",
  external: "notices-external",
  scholarship: "notices-scholarship",
};

export function generateStaticParams() {
  return Object.entries(BOARD_PARAM).flatMap(([board, key]) =>
    BOARD_DATA[key].map((p) => ({ board, id: p.sourcePostId }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ board: string; id: string }> }): Promise<Metadata> {
  const { board, id } = await params;
  const key = BOARD_PARAM[board];
  const post = key ? BOARD_DATA[key].find((p) => p.sourcePostId === id) : null;
  return { title: post?.title ?? "공지사항" };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ board: string; id: string }> }) {
  const { board, id } = await params;
  const key = BOARD_PARAM[board];
  if (!key) notFound();
  const post = BOARD_DATA[key].find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = getAdjacent(key, id);

  return (
    <PostDetail
      post={post}
      lang="ko"
      backHref={listHref("ko", key)}
      prev={prev ? { href: postHref("ko", key, prev.sourcePostId), title: prev.title } : null}
      next={next ? { href: postHref("ko", key, next.sourcePostId), title: next.title } : null}
    />
  );
}
