import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { getBoard, getAdjacent } from "@/lib/community-data";
import { postHref, listHref, type BoardKey } from "@/lib/community-content";

export const dynamic = "force-dynamic";

const BOARD_PARAM: Record<string, BoardKey> = {
  undergraduate: "notices-undergraduate",
  graduate: "notices-graduate",
  external: "notices-external",
  scholarship: "notices-scholarship",
};

export async function generateStaticParams() {
  const entries = Object.entries(BOARD_PARAM);
  const boards = await Promise.all(entries.map(([, key]) => getBoard(key)));
  return entries.flatMap(([board], i) => boards[i].map((p) => ({ board, id: p.sourcePostId })));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string; id: string }> }): Promise<Metadata> {
  const { board, id } = await params;
  const key = BOARD_PARAM[board];
  const post = key ? (await getBoard(key)).find((p) => p.sourcePostId === id) : null;
  return { title: post?.title ?? "공지사항" };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ board: string; id: string }> }) {
  const { board, id } = await params;
  const key = BOARD_PARAM[board];
  if (!key) notFound();
  const post = (await getBoard(key)).find((p) => p.sourcePostId === id);
  if (!post) notFound();

  const { prev, next } = await getAdjacent(key, id);

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
