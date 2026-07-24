import type { CommunityPost } from "@/lib/community-content";

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

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
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

      <div>
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
        >
          저장
        </button>
      </div>
    </form>
  );
}
