"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { CourseOption } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

const TYPE_OPTIONS = [
  { value: "전필", ko: "전공필수", en: "Major Required" },
  { value: "전선", ko: "전공선택", en: "Major Elective" },
  { value: "전기", ko: "전공기초", en: "Major Basic" },
  { value: "대교", ko: "교양", en: "Liberal Arts" },
  { value: "기타", ko: "기타(일반선택 등)", en: "Other (free elective, etc.)" },
];

const CREDIT_OPTIONS = [0.5, 1, 1.5, 2, 3, 4];

const COPY = {
  ko: {
    toggle: "목록에 없는 과목 직접 추가",
    name: "과목명",
    namePlaceholder: "예: 경제학입문",
    credit: "학점",
    type: "이수구분",
    add: "추가",
  },
  en: {
    toggle: "Add a course not in the list",
    name: "Course name",
    namePlaceholder: "e.g. Introduction to Economics",
    credit: "Credits",
    type: "Category",
    add: "Add",
  },
};

/** Free-form entry for courses outside the ME catalog (other departments'
 * majors, liberal arts, ...) — the safety net when a course isn't in the
 * search index and wasn't captured by transcript import. */
export default function ManualCourseAdd({ lang, onAdd }: { lang: Lang; onAdd: (course: CourseOption) => void }) {
  const t = COPY[lang];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credit, setCredit] = useState("3");
  const [courseType, setCourseType] = useState("대교");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      courseCode: `manual-${Date.now()}`,
      nameKr: trimmed,
      nameEn: null,
      courseType,
      credit: Number(credit),
      status: "manual",
    });
    setName("");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {t.toggle}
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-end gap-3 rounded-md border border-line bg-surface-muted/50 p-3">
      <label className="min-w-[180px] flex-1 text-xs text-ink/60">
        {t.name}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={t.namePlaceholder}
          className="mt-1 block min-h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
      </label>
      <label className="text-xs text-ink/60">
        {t.credit}
        <select
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          className="mt-1 block min-h-10 rounded-md border border-line bg-white px-2 text-sm text-ink focus:border-primary focus:outline-none"
        >
          {CREDIT_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-ink/60">
        {t.type}
        <select
          value={courseType}
          onChange={(e) => setCourseType(e.target.value)}
          className="mt-1 block min-h-10 rounded-md border border-line bg-white px-2 text-sm text-ink focus:border-primary focus:outline-none"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {lang === "ko" ? o.ko : o.en}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!name.trim()}
        className="min-h-10 rounded-sm bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:bg-ink/20"
      >
        {t.add}
      </button>
    </div>
  );
}
