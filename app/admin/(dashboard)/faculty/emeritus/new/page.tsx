import EmeritusForm from "@/components/admin/EmeritusForm";
import { createEmeritusAction } from "@/lib/admin/faculty-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "명예교수 추가" };

export default function NewEmeritusPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">명예·퇴임 교수 추가</h1>
      <div className="mt-8">
        <EmeritusForm action={createEmeritusAction} />
      </div>
    </div>
  );
}
