import Link from "next/link";
import { logoutAction } from "@/lib/admin/auth-actions";
import { BOARD_META } from "@/lib/community-content";
import type { BoardKey } from "@/lib/community-content";

const NAV_BOARDS: BoardKey[] = [
  "notices-undergraduate",
  "notices-graduate",
  "notices-external",
  "notices-scholarship",
  "news",
  "events",
  "seminars",
  "jobs",
  "thesis-reviews",
  "resources",
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-line bg-white px-4 py-6">
        <Link href="/admin" className="block font-display text-lg text-ink">
          관리자 페이지
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <p className="mt-2 mb-1 px-2 text-xs font-semibold tracking-wide text-ink/40">공지·뉴스·커뮤니티</p>
          {NAV_BOARDS.map((key) => (
            <Link
              key={key}
              href={`/admin/board/${key}`}
              className="rounded-md px-2 py-1.5 text-ink/75 hover:bg-surface-muted hover:text-primary"
            >
              {BOARD_META[key].labelKo}
            </Link>
          ))}
          <p className="mt-4 mb-1 px-2 text-xs font-semibold tracking-wide text-ink/40">교수진</p>
          <Link href="/admin/faculty" className="rounded-md px-2 py-1.5 text-ink/75 hover:bg-surface-muted hover:text-primary">
            전임교수
          </Link>
          <Link
            href="/admin/faculty/emeritus"
            className="rounded-md px-2 py-1.5 text-ink/75 hover:bg-surface-muted hover:text-primary"
          >
            명예교수
          </Link>
        </nav>
        <form action={logoutAction} className="mt-8 border-t border-line pt-4">
          <button type="submit" className="text-sm text-ink/50 hover:text-primary">
            로그아웃
          </button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
