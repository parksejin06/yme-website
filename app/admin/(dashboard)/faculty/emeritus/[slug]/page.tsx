import { notFound } from "next/navigation";
import EmeritusForm from "@/components/admin/EmeritusForm";
import { getFacultyEmeritus } from "@/lib/faculty-data";
import { updateEmeritusAction } from "@/lib/admin/faculty-actions";

export const dynamic = "force-dynamic";

export default async function EditEmeritusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = (await getFacultyEmeritus()).find((f) => f.slug === slug);
  if (!member) notFound();
  const action = updateEmeritusAction.bind(null, slug);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">{member.name} 교수 정보 수정</h1>
      <div className="mt-8">
        <EmeritusForm action={action} member={member} />
      </div>
    </div>
  );
}
