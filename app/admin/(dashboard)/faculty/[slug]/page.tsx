import { notFound } from "next/navigation";
import FacultyForm from "@/components/admin/FacultyForm";
import { getFaculty } from "@/lib/faculty-data";
import { updateFacultyAction } from "@/lib/admin/faculty-actions";

export const dynamic = "force-dynamic";

export default async function EditFacultyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = (await getFaculty()).find((f) => f.slug === slug);
  if (!member) notFound();
  const action = updateFacultyAction.bind(null, slug);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">{member.name} 교수 정보 수정</h1>
      <div className="mt-8">
        <FacultyForm action={action} member={member} />
      </div>
    </div>
  );
}
