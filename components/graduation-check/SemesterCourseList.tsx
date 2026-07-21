"use client";

import { X } from "lucide-react";
import type { SelectedCourse } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

export default function SemesterCourseList({
  courses,
  onRemove,
  lang,
}: {
  courses: SelectedCourse[];
  onRemove: (courseCode: string) => void;
  lang: Lang;
}) {
  if (courses.length === 0) {
    return <p className="mt-4 text-sm text-ink/40">{lang === "ko" ? "아직 추가한 과목이 없습니다." : "No courses added yet."}</p>;
  }

  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {courses.map((c) => (
        <li
          key={c.courseCode}
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface-muted/60 py-1.5 pl-3 pr-1.5 text-sm text-ink/80"
        >
          <span>{c.nameKr}</span>
          <span className="text-xs text-ink/40" style={{ fontVariantNumeric: "tabular-nums" }}>
            {c.credit}
            {lang === "ko" ? "학점" : "cr"}
          </span>
          <button
            type="button"
            onClick={() => onRemove(c.courseCode)}
            aria-label={lang === "ko" ? `${c.nameKr} 삭제` : `Remove ${c.nameKr}`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-ink/40 hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}
