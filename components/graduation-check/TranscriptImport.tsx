"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp, ShieldCheck, Loader2, ChevronDown, ExternalLink } from "lucide-react";
import { parseTranscript, toSemesterKey } from "@/lib/graduation-check/transcript-parser";
import { SEMESTER_KEYS } from "@/lib/graduation-check/constants";
import type { SemesterMap } from "@/lib/graduation-check/types";
import type { Lang } from "@/lib/nav";

// Base SSO login entry point for the Yonsei academic portal — deliberately the
// bare login URL, not a deep link into the 성적 > 전체성적조회 report itself,
// since that report URL carries a short-lived requestTimeStr query param.
const PORTAL_LOGIN_URL = "https://underwood1.yonsei.ac.kr/com/lgin/SsoCtr/initPageWork.do";

const COPY = {
  ko: {
    title: "성적표 PDF로 한 번에 입력",
    guide: "연세포탈 → 성적 → 전체성적조회 → 출력에서 인쇄(Ctrl+P) 후 “PDF로 저장”한 파일을 올려주세요. 캡쳐 이미지가 아니라 PDF 파일이어야 글자를 정확히 읽을 수 있습니다.",
    privacy: "업로드한 PDF는 브라우저 안에서만 처리되며 서버로 전송·저장되지 않습니다.",
    portalHint: "학교 포털에서 로그인 후 성적증명서를 다운로드받아 아래에 업로드해주세요.",
    portalCta: "성적표 발급받기",
    pick: "성적표 PDF 선택",
    reading: "PDF를 읽는 중…",
    detected: (n: number, sems: number, credits: number) => `${n}개 과목 · ${sems}개 학기 · ${credits}학점 인식됨`,
    admission: (y: number) => `학번에서 입학년도 ${y}년을 자동 인식했습니다.`,
    excluded: (n: number) => `F/NP 등 학점 미취득 ${n}과목은 제외했습니다.`,
    failed: (n: number) => `${n}개 행은 형식을 인식하지 못했습니다. 가져온 뒤 직접 추가해주세요.`,
    nothing: "인식된 과목이 없습니다. 캡쳐 이미지가 아니라 ‘출력 → PDF로 저장’한 파일인지 확인해주세요.",
    error: "PDF를 읽지 못했습니다. 파일이 손상되었거나 PDF 형식이 아닐 수 있습니다.",
    apply: "이 내용으로 입력하기",
    replaceConfirm: "기존에 입력한 과목을 모두 지우고 성적표 내용으로 바꿀까요?",
    pasteToggle: "PDF가 안 되면: 텍스트 직접 붙여넣기",
    pastePlaceholder: "성적표 텍스트를 붙여넣으세요",
  },
  en: {
    title: "Import everything from your transcript PDF",
    guide: "In the Yonsei portal, open Grades → Full Grade Report → Print, use your browser's Print (Ctrl+P) and “Save as PDF,” then upload that file. It must be a PDF, not a screenshot image, so the text can be read accurately.",
    privacy: "The uploaded PDF is processed only in your browser and is never sent to or stored on a server.",
    portalHint: "Log in to the school portal, download your transcript, then upload it below.",
    portalCta: "Get your transcript",
    pick: "Choose transcript PDF",
    reading: "Reading PDF…",
    detected: (n: number, sems: number, credits: number) => `Detected ${n} courses · ${sems} semesters · ${credits} credits`,
    admission: (y: number) => `Admission year ${y} detected from your student ID.`,
    excluded: (n: number) => `Skipped ${n} course(s) with no earned credit (F/NP).`,
    failed: (n: number) => `${n} row(s) couldn't be parsed — add them manually after importing.`,
    nothing: "No courses recognized. Make sure it's a “Save as PDF” file, not a screenshot image.",
    error: "Couldn't read the PDF. The file may be corrupt or not a PDF.",
    apply: "Import these courses",
    replaceConfirm: "Replace everything you've entered with the transcript?",
    pasteToggle: "PDF not working? Paste text instead",
    pastePlaceholder: "Paste the transcript text",
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
  const [reading, setReading] = useState(false);
  const [error, setError] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => (text.trim() ? parseTranscript(text) : null), [text]);

  const preview = useMemo(() => {
    if (!parsed || parsed.courses.length === 0) return null;
    const semesterSet = new Set(parsed.courses.map((c) => `${c.year}-${c.term}`));
    const credits = parsed.courses.reduce((s, c) => s + c.credit, 0);
    return { count: parsed.courses.length, semesters: semesterSet.size, credits };
  }, [parsed]);

  async function handleFile(file: File) {
    setError(false);
    setFileName(file.name);
    setReading(true);
    try {
      // Dynamically imported so pdf.js (and its worker) only load when a file
      // is actually picked, keeping it out of the initial page bundle.
      const { extractPdfText } = await import("@/lib/graduation-check/pdf-text");
      const extracted = await extractPdfText(file);
      setText(extracted);
    } catch {
      setError(true);
      setText("");
    } finally {
      setReading(false);
    }
  }

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
    setFileName(null);
  }

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/[0.03] p-5">
      <p className="flex items-center gap-2 font-display text-base text-ink">
        <FileUp className="h-4 w-4 text-primary" aria-hidden="true" />
        {t.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.guide}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/45">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t.privacy}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-line bg-white px-4 py-3">
        <a
          href={PORTAL_LOGIN_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          {t.portalCta} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <p className="text-xs text-ink/55">{t.portalHint}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={reading}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:bg-ink/20"
        >
          {reading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileUp className="h-4 w-4" aria-hidden="true" />}
          {reading ? t.reading : t.pick}
        </button>
        {fileName && !reading && <span className="max-w-[16rem] truncate text-xs text-ink/50">{fileName}</span>}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{t.error}</p>}

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

      {/* Fallback for anyone whose PDF has no text layer: paste text directly. */}
      <div className="mt-4 border-t border-line/70 pt-3">
        <button
          type="button"
          onClick={() => setShowPaste((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink/45 hover:text-ink"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showPaste ? "rotate-180" : ""}`} aria-hidden="true" />
          {t.pasteToggle}
        </button>
        {showPaste && (
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFileName(null);
              setError(false);
            }}
            placeholder={t.pastePlaceholder}
            rows={4}
            className="mt-2 w-full rounded-md border border-line bg-white p-3 font-mono text-xs text-ink placeholder:text-ink/35 focus:border-primary focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
