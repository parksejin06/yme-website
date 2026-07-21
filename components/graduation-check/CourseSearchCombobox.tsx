"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { searchCourses } from "@/lib/graduation-check/course-index";
import type { CourseOption } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    placeholder: "학수번호 또는 과목명 검색 (예: 공학수학, MAT1011)",
    noResults: "검색 결과가 없습니다.",
    draft: "확인 필요",
  },
  en: {
    placeholder: "Search by course code or name (e.g. Engineering Math, MAT1011)",
    noResults: "No matching courses.",
    draft: "Unverified",
  },
};

export default function CourseSearchCombobox({
  onSelect,
  excludeCodes,
  lang,
}: {
  onSelect: (course: CourseOption) => void;
  excludeCodes: string[];
  lang: Lang;
}) {
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = searchCourses(query).filter((c) => !excludeCodes.includes(c.courseCode));

  useEffect(() => () => cancelClose(), []);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function onFocus() {
    cancelClose();
    setOpen(true);
  }

  function onBlur() {
    scheduleClose();
  }

  function pick(course: CourseOption) {
    cancelClose();
    onSelect(course);
    setQuery("");
    setOpen(false);
    setHighlighted(0);
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          type="text"
          value={query}
          onChange={(e) => {
            cancelClose();
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          className="min-h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
        />
      </div>

      {open && query.trim() && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-white shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/40">{t.noResults}</li>
          ) : (
            results.map((c, i) => (
              <li key={c.courseCode}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === highlighted}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(c)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === highlighted ? "bg-surface-muted text-primary" : "text-ink/80"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.nameKr}</span>
                    {c.status === "draft" && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">{t.draft}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-ink/40" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {c.courseCode} · {c.credit}
                    {lang === "ko" ? "학점" : "cr"}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
