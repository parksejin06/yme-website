import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { BOARD_META, type BoardKey } from "@/lib/community-content";
import { createPostAction } from "@/lib/admin/community-actions";

export const dynamic = "force-dynamic";

export default async function NewPostPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in BOARD_META)) notFound();
  const board = key as BoardKey;
  const action = createPostAction.bind(null, board);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">{BOARD_META[board].labelKo} · 새 글 작성</h1>
      <div className="mt-8">
        <PostForm action={action} />
      </div>
    </div>
  );
}
