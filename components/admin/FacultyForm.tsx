import type { FacultyMember } from "@/lib/faculty";

const FIELDS = ["역학·소재", "에너지·열유체", "로보틱스·제어", "설계·제조", "마이크로·나노", "바이오·포토닉스"];

export default function FacultyForm({
  action,
  member,
}: {
  action: (formData: FormData) => Promise<void>;
  member?: FacultyMember;
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
        연구분야 *
        <select
          name="field"
          defaultValue={member?.field ?? FIELDS[0]}
          required
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        >
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
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
          전화번호
          <input
            type="text"
            name="phone"
            defaultValue={member?.phone ?? ""}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        사무실 위치
        <input
          type="text"
          name="office"
          defaultValue={member?.office ?? ""}
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          연구실명
          <input
            type="text"
            name="labName"
            defaultValue={member?.labName ?? ""}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          연구실 홈페이지
          <input
            type="url"
            name="labUrl"
            defaultValue={member?.labUrl ?? ""}
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink/70">
        사진
        {member?.photoPath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoPath}
            alt=""
            className="h-24 w-24 rounded-md border border-line object-cover"
          />
        )}
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none file:mr-3 file:rounded-sm file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-sm focus:border-primary"
        />
        <span className="text-xs text-ink/45">
          {member ? "새 사진을 올리지 않으면 기존 사진이 유지됩니다." : "비워두면 사진 없이 표시됩니다."}
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
