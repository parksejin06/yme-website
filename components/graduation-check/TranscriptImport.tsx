"use client";

import { useMemo, useState } from "react";
import { ClipboardPaste, ShieldCheck } from "lucide-react";
import { parseTranscript, toSemesterKey } from "@/lib/graduation-check/transcript-parser";
import { SEMESTER_KEYS } from "@/lib/graduation-check/constants";
import type { SemesterMap } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    title: "성적표 붙여넣기로 한 번에 입력",
    guide: "연세포탈 → 학사행정 → 성적 → 전체성적조회 화면에서 성적표 전체를 드래그해 복사한 뒤 아래에 붙여넣으세요. 출력(PDF)에서 복사한 텍스트도 인식됩니다.",
    privacy: "붙여넣은 내용은 브라우저 안에서만 처리되며 서버로 전송되지 않습니다.",
    placeholder: "여기에 성적표 내용을 붙여넣으세요",
    detected: (n: number, sems: number, credits: number) => `${n}개 과목 · ${sems}개 학기 · ${credits}학점 인식됨`,
    admission: (y: number) => `학번에서 입학년도 ${y}년을 자동 인식했습니다.`,
    excluded: (n: number) => `F/NP 등 학점 미취득 ${n}과목은 제외했습니다.`,
    failed: (n: number) => `${n}개 행은 형식을 인식하지 못했습니다. 가져온 뒤 직접 추가해주세요.`,
    nothing: "인식된 과목이 없습니다. 성적표 표 부분을 복사했는지 확인해주세요.",
    apply: "이 내용으로 입력하기",
    replaceConfirm: "기존에 입력한 과목을 모두 지우고 성적표 내용으로 바꿀까요?",
  },
  en: {
    title: "Paste your transcript to fill everything at once",
    guide: "In the Yonsei portal, open Grades → Full Grade Report, select the whole table, copy it, and paste it below. Text copied from the print (PDF) view also works.",
    privacy: "Pasted text is processed only in your browser and never sent to a server.",
    placeholder: "Paste your transcript here",
    detected: (n: number, sems: number, credits: number) => `Detected ${n} courses · ${sems} semesters · ${credits} credits`,
    admission: (y: number) => `Admission year ${y} detected from your student ID.`,
    excluded: (n: number) => `Skipped ${n} course(s) with no earned credit (F/NP).`,
    failed: (n: number) => `${n} row(s) couldn't be parsed — add them manually after importing.`,
    nothing: "No courses recognized. Make sure you copied the grade table itself.",
    apply: "Import these courses",
    replaceConfirm: "Replace everything you've entered with the pasted transcript?",
  },
};

export default function TranscriptImport({
  lang,
  hasExistingCourses,
  onImport,
}: {
  lang: Lang;
  hasExistingCourses: boolean;
  onImport: (semesters: SemesterMap, admissionYear: number | null) => void;
}) {
  const t = COPY[lang];
  const [text, setText] = useState("");

  const parsed = useMemo(() => (text.trim() ? parseTranscript(text) : null), [text]);

  const preview = useMemo(() => {
    if (!parsed || parsed.courses.length === 0) return null;
    const semesterSet = new Set(parsed.courses.map((c) => `${c.year}-${c.term}`));
    const credits = parsed.courses.reduce((s, c) => s + c.credit, 0);
    return { count: parsed.courses.length, semesters: semesterSet.size, credits };
  }, [parsed]);

  function handleApply() {
    if (!parsed || parsed.courses.length === 0) return;
    if (hasExistingCourses && !window.confirm(t.replaceConfirm)) return;

    const admissionYear = parsed.admissionYear ?? Math.min(...parsed.courses.map((c) => c.year));
    const semesters = {} as SemesterMap;
    for (const key of SEMESTER_KEYS) semesters[key] = [];
    for (const c of parsed.courses) {
      const key = toSemesterKey(c, admissionYear);
      if (semesters[key].some((existing) => existing.courseCode === c.courseCode)) continue;
      semesters[key].push({
        courseCode: c.courseCode,
        nameKr: c.name,
        nameEn: null,
        courseType: c.categoryCode,
        credit: c.credit,
        status: "imported",
      });
    }
    onImport(semesters, parsed.admissionYear);
    setText("");
  }

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/[0.03] p-5">
      <p className="flex items-center gap-2 font-display text-base text-ink">
        <ClipboardPaste className="h-4 w-4 text-primary" aria-hidden="true" />
        {t.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.guide}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/45">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t.privacy}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        rows={5}
        className="mt-4 w-full rounded-md border border-line bg-white p-3 font-mono text-xs text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
      />

      {parsed && (
        <div className="mt-3 space-y-1 text-sm">
          {preview ? (
            <>
              <p className="font-medium text-primary">{t.detected(preview.count, preview.semesters, preview.credits)}</p>
              {parsed.admissionYear != null && <p className="text-xs text-ink/55">{t.admission(parsed.admissionYear)}</p>}
              {parsed.excludedCount > 0 && <p className="text-xs text-ink/55">{t.excluded(parsed.excludedCount)}</p>}
              {parsed.failedCount > 0 && <p className="text-xs text-amber-700">{t.failed(parsed.failedCount)}</p>}
            </>
          ) : (
            <p className="text-xs text-ink/50">{t.nothing}</p>
          )}
        </div>
      )}

      {preview && (
        <button
          type="button"
          onClick={handleApply}
          className="mt-4 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
        >
          {t.apply}
        </button>
      )}
    </div>
  );
}
