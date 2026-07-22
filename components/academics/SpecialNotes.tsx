import type { Lang } from "@/lib/academics";

export interface SpecialNote {
  category: string;
  content: string;
}

export default function SpecialNotes({ notes, lang }: { notes: SpecialNote[]; lang: Lang }) {
  if (notes.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-xl text-ink">
        {lang === "ko" ? "학번별 특이사항 및 예외" : "Cohort-Specific Notes & Exceptions"}
      </h2>
      <ul className="mt-4 space-y-3">
        {notes.map((n, i) => (
          <li key={i} className="rounded-lg border border-line p-4">
            <p className="font-display text-sm text-ink">{n.category}</p>
            <p className="mt-1.5 text-sm text-ink/70">{n.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
