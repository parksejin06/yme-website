import type { EmeritusFaculty } from "@/components/EmeritusFacultyGrid";

export default function EmeritusForm({
  action,
  member,
}: {
  action: (formData: FormData) => Promise<void>;
  member?: EmeritusFaculty;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        이름 *
        <input
          type="text"
          name="name"
          defaultValue={member?.name}
          required
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        영문 이름
        <input
          type="text"
          name="nameEn"
          defaultValue={member?.nameEn ?? ""}
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          주요 전공·연구분야
          <input
            type="text"
            name="field"
            defaultValue={member?.field ?? ""}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          재직기간
          <input
            type="text"
            name="tenure"
            defaultValue={member?.tenure ?? ""}
            placeholder="1977 - 2013"
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        이메일
        <input
          type="email"
          name="email"
          defaultValue={member?.email ?? ""}
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        사진 경로
        <input
          type="text"
          name="photoPath"
          defaultValue={member?.photoPath ?? ""}
          placeholder="/assets/faculty/emeritus/이름.png"
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
        <span className="text-xs text-ink/45">
          사진 파일을 public/assets/faculty/emeritus/ 폴더에 직접 올린 뒤 경로를 입력해주세요.
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
