import Link from "next/link";
import { notFound } from "next/navigation";
import { BOARD_DATA } from "@/lib/community-data";
import { BOARD_META, type BoardKey } from "@/lib/community-content";
import { deletePostAction } from "@/lib/admin/community-actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminBoardListPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in BOARD_META)) notFound();
  const board = key as BoardKey;
  const posts = [...BOARD_DATA[board]].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{BOARD_META[board].labelKo}</h1>
        <Link
          href={`/admin/board/${board}/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
        >
          새 글 작성
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">
                {post.isPinned && <span className="mr-2 text-xs font-semibold text-accent">[고정]</span>}
                {post.title}
              </p>
              <p className="mt-0.5 text-xs text-ink/45">
                {post.publishedAt ?? "날짜 없음"} · {post.author ?? "작성자 없음"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/board/${board}/${post.sourcePostId}`} className="text-primary hover:underline">
                수정
              </Link>
              <form action={deletePostAction.bind(null, board, post.sourcePostId)}>
                <ConfirmSubmitButton confirmMessage="이 글을 삭제할까요?" className="text-ink/50 hover:text-red-600">
                  삭제
                </ConfirmSubmitButton>
              </form>
            </div>
          </li>
        ))}
        {posts.length === 0 && <li className="py-8 text-center text-sm text-ink/45">등록된 글이 없습니다.</li>}
      </ul>
    </div>
  );
}
