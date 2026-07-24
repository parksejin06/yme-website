"use server";

import { redirect } from "next/navigation";
import { getBoard, writeBoardData } from "@/lib/community-data";
import { BOARD_META, type BoardKey, type CommunityPost } from "@/lib/community-content";

function toParagraphHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function buildPost(board: BoardKey, formData: FormData, existing?: CommunityPost): CommunityPost {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || null;
  const publishedAtInput = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtInput ? publishedAtInput.replaceAll("-", ".") : (existing?.publishedAt ?? null);
  const plainText = String(formData.get("body") ?? "")
    .replace(/\r\n?/g, "\n")
    .trim();
  const isPinned = formData.get("isPinned") === "on";
  const isNew = formData.get("isNew") === "on";

  const sourcePostId = existing?.sourcePostId ?? `admin-${Date.now()}`;

  return {
    id: existing?.id ?? `${board}-${sourcePostId}`,
    sourceBoard: board,
    sourcePostId,
    category: BOARD_META[board].labelKo,
    title,
    author,
    publishedAt,
    isPinned,
    isNew,
    originalHtml: toParagraphHtml(plainText),
    plainText,
    excerpt: plainText.slice(0, 140),
    attachments: existing?.attachments ?? [],
    contentImages: existing?.contentImages ?? [],
    sourceUrl: existing?.sourceUrl ?? "",
    importedAt: existing?.importedAt ?? new Date().toISOString(),
  };
}

export async function createPostAction(board: BoardKey, formData: FormData) {
  const post = buildPost(board, formData);
  await writeBoardData(board, [post, ...(await getBoard(board))]);
  redirect(`/admin/board/${board}`);
}

export async function updatePostAction(board: BoardKey, sourcePostId: string, formData: FormData) {
  const list = await getBoard(board);
  const idx = list.findIndex((p) => p.sourcePostId === sourcePostId);
  if (idx === -1) redirect(`/admin/board/${board}`);
  const next = [...list];
  next[idx] = buildPost(board, formData, list[idx]);
  await writeBoardData(board, next);
  redirect(`/admin/board/${board}`);
}

export async function deletePostAction(board: BoardKey, sourcePostId: string) {
  const list = await getBoard(board);
  await writeBoardData(
    board,
    list.filter((p) => p.sourcePostId !== sourcePostId)
  );
  redirect(`/admin/board/${board}`);
}
