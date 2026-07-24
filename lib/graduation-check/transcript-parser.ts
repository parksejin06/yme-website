import { STUDENT_GROUPS } from "@/lib/academics";
import type { SemesterKey } from "./types";

/**
 * Parses the text a student gets by copying their 전체성적조회 table (or its
 * 출력 PDF) from the Yonsei portal. Everything runs in the browser — the
 * pasted text is never sent to a server.
 *
 * The layout varies with how the table was copied (HTML drag-copy is
 * tab-separated, PDF copy can break cells across lines), so parsing anchors
 * on distinctive token patterns instead of column positions:
 *  - semester headers:  "2025학년도 1학기" / "2025학년도 여름계절학기"
 *  - course codes:      "MEU2600", "YCA1007", ... ([A-Z]{2,4} + 4 digits)
 *  - grade tokens:      A+/A0/.../F/P/NP — each course row ends with
 *                       [담당교수] 학점 평가 백분위 ... so the grade token
 *                       anchors the tail of the row.
 */

export interface ParsedTranscriptCourse {
  courseCode: string;
  name: string;
  /** Raw 과목종별 code from the portal (전필, 전선, 전기, 대교, 계기, ...). */
  categoryCode: string;
  credit: number;
  grade: string;
  year: number;
  term: "1" | "2" | "su" | "wi";
}

export interface ParsedTranscript {
  /** From the 학번 field if present in the pasted text. */
  admissionYear: number | null;
  courses: ParsedTranscriptCourse[];
  /** Course codes found but whose row couldn't be parsed. */
  failedCount: number;
  /** Courses skipped because the grade earns no credit (F/NP/W). */
  excludedCount: number;
}

/** 과목종별 codes seen on official transcripts. Unknown codes still parse —
 * they just land in "기타" so their credits count toward the total only. */
const KNOWN_CATEGORY_CODES = new Set([
  "전필", "전선", "전기", "대교", "교기", "교필", "교선", "계기", "공기",
  "학기", "학필", "학선", "일선", "자선", "군사", "RC", "CC",
]);

const COURSE_CODE_RE = /\b([A-Z]{2,4}\d{4})\b/g;
const SEMESTER_RE = /(\d{4})\s*학\s*년\s*도\s*(1|2|여\s*름|겨\s*울)/g;
const GRADE_RE = /^(A\+|A0|A-|B\+|B0|B-|C\+|C0|C-|D\+|D0|D-|F|P|NP|W)$/;
const NO_CREDIT_GRADES = new Set(["F", "NP", "W"]);
const STUDENT_ID_RE = /\b(20\d{2})\d{6}\b/;

function termOf(raw: string): "1" | "2" | "su" | "wi" {
  const t = raw.replace(/\s/g, "");
  if (t === "1") return "1";
  if (t === "2") return "2";
  return t.startsWith("여") ? "su" : "wi";
}

export function parseTranscript(text: string): ParsedTranscript {
  const admissionYear = (() => {
    const m = text.match(STUDENT_ID_RE);
    return m ? Number(m[1]) : null;
  })();

  // Semester headers and course codes located by position; each course
  // belongs to the nearest preceding semester header.
  const semesters: { index: number; year: number; term: "1" | "2" | "su" | "wi" }[] = [];
  for (const m of text.matchAll(SEMESTER_RE)) {
    semesters.push({ index: m.index ?? 0, year: Number(m[1]), term: termOf(m[2]) });
  }

  const codeMatches = [...text.matchAll(COURSE_CODE_RE)];
  const courses: ParsedTranscriptCourse[] = [];
  let failedCount = 0;
  let excludedCount = 0;

  for (let i = 0; i < codeMatches.length; i++) {
    const m = codeMatches[i];
    const code = m[1];
    const pos = m.index ?? 0;

    const sem = [...semesters].reverse().find((s) => s.index < pos);
    if (!sem) {
      failedCount++;
      continue;
    }

    // 과목종별 sits between the previous row (or semester header) and this
    // code — take the last known category token in that window.
    const windowStart = i > 0 ? (codeMatches[i - 1].index ?? 0) + codeMatches[i - 1][1].length : sem.index;
    const beforeTokens = text.slice(windowStart, pos).split(/\s+/).filter(Boolean);
    const categoryCode = [...beforeTokens].reverse().find((tk) => KNOWN_CATEGORY_CODES.has(tk)) ?? "기타";

    // Row tail: from after the code to the next code/semester header.
    const nextCodePos = i + 1 < codeMatches.length ? (codeMatches[i + 1].index ?? text.length) : text.length;
    const nextSemPos = semesters.find((s) => s.index > pos)?.index ?? text.length;
    const tailTokens = text
      .slice(pos + code.length, Math.min(nextCodePos, nextSemPos))
      .split(/\s+/)
      .filter(Boolean);

    // Drop the leading 분반 (2-digit section number) if present.
    if (tailTokens[0] && /^\d{2}$/.test(tailTokens[0])) tailTokens.shift();

    // The grade token anchors the row tail: ... 교수명 학점 "평가" 백분위 환산
    let gradeIdx = -1;
    for (let j = tailTokens.length - 1; j >= 0; j--) {
      if (GRADE_RE.test(tailTokens[j])) {
        gradeIdx = j;
        break;
      }
    }
    const credit = gradeIdx >= 1 ? Number(tailTokens[gradeIdx - 1]) : NaN;
    if (gradeIdx < 1 || Number.isNaN(credit) || credit <= 0 || credit > 10) {
      failedCount++;
      continue;
    }
    const grade = tailTokens[gradeIdx];
    if (NO_CREDIT_GRADES.has(grade)) {
      excludedCount++;
      continue;
    }

    // Between 분반 and the grade sit: 과목명(may contain spaces) + 담당교수.
    // The instructor is a single token right before the credit.
    const nameEnd = Math.max(gradeIdx - 2, 0);
    const name = tailTokens.slice(0, nameEnd).join(" ").trim() || code;

    courses.push({ courseCode: code, name, categoryCode, credit, grade, year: sem.year, term: sem.term });
  }

  return { admissionYear, courses, failedCount, excludedCount };
}

/** Maps a course's calendar semester to a program semester relative to the
 * admission year, clamping 5th-year-and-later work into year 4. */
export function toSemesterKey(course: ParsedTranscriptCourse, admissionYear: number): SemesterKey {
  const yearIndex = Math.min(Math.max(course.year - admissionYear + 1, 1), 4);
  return `${yearIndex}-${course.term}` as SemesterKey;
}

/** Finds the graduation-requirement cohort slug ("25", "15-17", ...) for an
 * admission year parsed from a student ID. Returns null when the year falls
 * outside the known cohorts (the student then picks manually). */
export function slugForAdmissionYear(admissionYear: number): string | null {
  const yy = admissionYear % 100;
  for (const g of STUDENT_GROUPS) {
    const exact = g.slug.match(/^(\d{2})$/);
    if (exact && Number(exact[1]) === yy) return g.slug;
    const range = g.slug.match(/^(\d{2})-(\d{2})$/);
    if (range && yy >= Number(range[1]) && yy <= Number(range[2])) return g.slug;
  }
  return null;
}
