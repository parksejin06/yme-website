import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getBoard } from "@/lib/community-data";
import { BOARD_META, type BoardKey } from "@/lib/community-content";
import { updatePostAction } from "@/lib/admin/community-actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ key: string; id: string }> }) {
  const { key, id } = await params;
  if (!(key in BOARD_META)) notFound();
  const board = key as BoardKey;
  const post = (await getBoard(board)).find((p) => p.sourcePostId === id);
  if (!post) notFound();
  const action = updatePostAction.bind(null, board, id);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">{BOARD_META[board].labelKo} · 글 수정</h1>
      <div className="mt-8">
        <PostForm action={action} post={post} />
      </div>
    </div>
  );
}
