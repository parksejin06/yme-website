import FacultyForm from "@/components/admin/FacultyForm";
import { createFacultyAction } from "@/lib/admin/faculty-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "교수 추가" };

export default function NewFacultyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">교수 추가</h1>
      <div className="mt-8">
        <FacultyForm action={createFacultyAction} />
      </div>
    </div>
  );
}
