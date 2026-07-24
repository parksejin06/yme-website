import Link from "next/link";
import { getFaculty } from "@/lib/faculty-data";
import { deleteFacultyAction } from "@/lib/admin/faculty-actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "전임교수" };

export default function AdminFacultyListPage() {
  const faculty = getFaculty();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">전임교수 ({faculty.length}명)</h1>
        <Link
          href="/admin/faculty/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
        >
          교수 추가
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {faculty.map((member) => (
          <li key={member.slug} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm text-ink">{member.name}</p>
              <p className="mt-0.5 text-xs text-ink/45">
                {member.field} · {member.labName ?? "연구실 미등록"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/faculty/${member.slug}`} className="text-primary hover:underline">
                수정
              </Link>
              <form action={deleteFacultyAction.bind(null, member.slug)}>
                <ConfirmSubmitButton confirmMessage={`${member.name} 교수 정보를 삭제할까요?`} className="text-ink/50 hover:text-red-600">
                  삭제
                </ConfirmSubmitButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
