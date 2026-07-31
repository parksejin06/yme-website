"use client";

import { useState, useTransition } from "react";
import { X, FileText } from "lucide-react";
import type { CommunityPost } from "@/lib/community-content";
import { compressImageFile } from "@/lib/admin/compress-image";
import { MAX_UPLOAD_BYTES } from "@/lib/admin/upload-limits";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: CommunityPost;
}) {
  const dateValue = post?.publishedAt
    ? post.publishedAt.replaceAll(".", "-")
    : new Date().toISOString().slice(0, 10);

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const overLimit = totalSize > MAX_UPLOAD_BYTES;

  async function handleFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow picking the same file again after removing it
    if (picked.length === 0) return;

    setError(null);
    const processed = await Promise.all(
      picked.map((f) => (f.type.startsWith("image/") ? compressImageFile(f) : f))
    );
    setFiles((prev) => [...prev, ...processed]);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (overLimit) {
      setError(`첨부파일 전체 용량이 너무 큽니다 (최대 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB). 파일을 줄이거나 제거해주세요.`);
      return;
    }
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.delete("attachments");
    for (const file of files) formData.append("attachments", file);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        제목 *
        <input
          type="text"
          name="title"
          defaultValue={post?.title}
          required
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          작성자
          <input
            type="text"
            name="author"
            defaultValue={post?.author ?? "기계공학부"}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          게시일
          <input
            type="date"
            name="publishedAt"
            defaultValue={dateValue}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="flex gap-6 text-sm text-ink/70">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPinned" defaultChecked={post?.isPinned} /> 상단 고정
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isNew" defaultChecked={post?.isNew ?? true} /> NEW 표시
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        본문 *
        <textarea
          name="body"
          rows={16}
          defaultValue={post?.plainText}
          required
          className="rounded-md border border-line bg-white px-3 py-2 font-mono text-sm leading-relaxed text-ink outline-none focus:border-primary"
        />
        <span className="text-xs text-ink/45">
          일반 텍스트로 저장됩니다. 표·이미지 등 서식이 있던 기존 공지를 수정하면 서식은 사라지고 텍스트만 남습니다
          (첨부파일 목록은 유지됩니다).
        </span>
      </label>

      {post && post.attachments.length > 0 && (
        <div className="flex flex-col gap-1.5 text-sm text-ink/70">
          기존 첨부파일 (유지됨)
          <ul className="flex flex-col gap-1 rounded-md border border-line bg-surface-muted/50 p-3 text-xs text-ink/60">
            {post.attachments.map((a) => (
              <li key={a.fileUrl} className="truncate">
                {a.fileName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-1.5 text-sm text-ink/70">
        새 첨부파일 (이미지·PDF·문서 등)
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.hwp,.hwpx,.xlsx,.xls,.zip"
          onChange={handleFilesPicked}
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none file:mr-3 file:rounded-sm file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-sm focus:border-primary"
        />
        <span className={`text-xs ${overLimit ? "font-medium text-red-600" : "text-ink/45"}`}>
          이미지는 자동으로 축소·압축됩니다. 전체 첨부파일 합계 {formatSize(totalSize)} / 최대{" "}
          {MAX_UPLOAD_BYTES / 1024 / 1024}MB
        </span>

        {files.length > 0 && (
          <ul className="mt-1 flex flex-col gap-2">
            {files.map((f, idx) => {
              const isImage = f.type.startsWith("image/");
              const previewUrl = isImage ? URL.createObjectURL(f) : null;
              return (
                <li
                  key={`${f.name}-${idx}`}
                  className="flex items-center gap-3 rounded-md border border-line bg-white px-3 py-2"
                >
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                  ) : (
                    <FileText className="h-8 w-8 shrink-0 text-ink/40" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm text-ink/80">{f.name}</span>
                  <span className="shrink-0 text-xs text-ink/40">{formatSize(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    aria-label={`${f.name} 제거`}
                    className="shrink-0 rounded p-1 text-ink/40 hover:bg-surface-muted hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong disabled:opacity-60"
        >
          {pending ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
