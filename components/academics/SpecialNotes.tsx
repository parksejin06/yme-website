import type { Lang } from "@/lib/academics";

export interface SpecialNote {
  category: string;
  content: string;
  importance: string;
}

const IMPORTANCE_STYLE: Record<string, string> = {
  "높음": "bg-rose-50 text-rose-700 border-rose-200",
  "중간": "bg-amber-50 text-amber-700 border-amber-200",
  "낮음": "bg-slate-100 text-slate-600 border-slate-200",
};

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm text-ink">{n.category}</span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${IMPORTANCE_STYLE[n.importance] ?? IMPORTANCE_STYLE["낮음"]}`}
              >
                {n.importance}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-ink/70">{n.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
