import { loginAction } from "@/lib/admin/auth-actions";

export const metadata = { title: "로그인" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl text-ink">관리자 로그인</h1>
      <p className="mt-1 text-sm text-ink/60">연세대학교 기계공학부 홈페이지 관리자 페이지입니다.</p>

      <form action={loginAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="next" value={next && next.startsWith("/admin") ? next : "/admin"} />
        <label className="flex flex-col gap-1.5 text-sm text-ink/70">
          비밀번호
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </label>
        {error && <p className="text-sm text-red-600">비밀번호가 올바르지 않습니다.</p>}
        <button
          type="submit"
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
