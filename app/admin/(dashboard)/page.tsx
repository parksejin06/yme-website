import Link from "next/link";
import { BOARD_DATA } from "@/lib/community-data";
import { BOARD_META, type BoardKey } from "@/lib/community-content";
import { getFaculty, getFacultyEmeritus } from "@/lib/faculty-data";

export const dynamic = "force-dynamic";

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

export default function AdminDashboardPage() {
  const faculty = getFaculty();
  const emeritus = getFacultyEmeritus();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">관리자 대시보드</h1>
      <p className="mt-2 text-sm text-ink/60">
        아래 항목을 클릭해 공지사항·뉴스·행사·교수 정보를 등록·수정·삭제할 수 있습니다. 저장하면 홈페이지에 바로 반영됩니다.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {NAV_BOARDS.map((key) => (
          <Link
            key={key}
            href={`/admin/board/${key}`}
            className="rounded-lg border border-line bg-white px-4 py-4 transition-colors hover:border-primary"
          >
            <p className="text-sm font-medium text-ink">{BOARD_META[key].labelKo}</p>
            <p className="mt-1 text-xs text-ink/45">{BOARD_DATA[key].length}건</p>
          </Link>
        ))}
        <Link
          href="/admin/faculty"
          className="rounded-lg border border-line bg-white px-4 py-4 transition-colors hover:border-primary"
        >
          <p className="text-sm font-medium text-ink">전임교수</p>
          <p className="mt-1 text-xs text-ink/45">{faculty.length}명</p>
        </Link>
        <Link
          href="/admin/faculty/emeritus"
          className="rounded-lg border border-line bg-white px-4 py-4 transition-colors hover:border-primary"
        >
          <p className="text-sm font-medium text-ink">명예·퇴임 교수</p>
          <p className="mt-1 text-xs text-ink/45">{emeritus.length}명</p>
        </Link>
      </div>
    </div>
  );
}
