import type { Lang } from "@/lib/academics";

export interface GradDetailRow {
  subcategory: string | null;
  type: string | null;
  credits: string | null;
  courses: string | null;
  courseCredits: string | null;
  designCredits: string | null;
  condition: string | null;
  note: string | null;
}

export interface GradDetailGroup {
  category: string;
  totalCredits: number | null;
  totalCreditsApprox: number | null;
  rows: GradDetailRow[];
}

// Only categories with an unambiguous, already-established English term (matching
// GraduationSummary's own LABELS map) are translated. Everything else is left in
// Korean, matching this page's stated policy: show Korean rather than risk
// mistranslating official graduation-requirement terminology.
const CATEGORY_LABELS_EN: Record<string, string> = {
  교양기초: "Basic Liberal Arts",
  대학교양: "University Liberal Arts",
  기초교육: "Basic Education",
  전공: "Major",
  전공기초: "Major Basic",
  일반선택: "Free Elective",
  자유선택: "Free Elective",
};

const TYPE_LABELS_EN: Record<string, string> = {
  필수: "Required",
  선택: "Elective",
};

const COPY = {
  ko: { colCategory: "종별", colType: "필수/선택", colCourses: "교과목(학점)", total: "계", empty: "—" },
  en: { colCategory: "Category", colType: "Required / Elective", colCourses: "Courses (Credits)", total: "Total", empty: "—" },
};

export default function GraduationDetailTable({
  groups,
  totalLabel,
  lang = "ko",
}: {
  groups: GradDetailGroup[];
  totalLabel: string | null;
  lang?: Lang;
}) {
  const t = COPY[lang];
  const categoryLabel = (category: string) => (lang === "en" ? (CATEGORY_LABELS_EN[category] ?? category) : category);
  const typeLabel = (type: string) => (lang === "en" ? (TYPE_LABELS_EN[type] ?? type) : type);

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-line">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-muted text-left">
            <th className="w-40 px-4 py-3 font-display font-normal text-ink/70">{t.colCategory}</th>
            <th className="w-32 px-4 py-3 font-display font-normal text-ink/70">{t.colType}</th>
            <th className="px-4 py-3 font-display font-normal text-ink/70">{t.colCourses}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) =>
            g.rows.map((r, i) => {
              const isPlainTotal = g.rows.length === 1 && !r.type && !r.courses;
              const catLabel = categoryLabel(g.category);
              const groupLabel =
                g.totalCredits != null
                  ? `${catLabel} (${g.totalCredits})`
                  : g.totalCreditsApprox != null
                    ? `${catLabel} (${g.totalCreditsApprox}+)`
                    : catLabel;
              return (
                <tr key={`${g.category}-${i}`} className="border-t border-line align-top">
                  {i === 0 && (
                    <td
                      rowSpan={g.rows.length}
                      className="px-4 py-3.5 font-display text-ink"
                    >
                      {groupLabel}
                    </td>
                  )}
                  {isPlainTotal ? (
                    <td colSpan={2} className="px-4 py-3.5 text-ink/40">
                      {t.empty}
                    </td>
                  ) : (
                    <>
                      <td className="whitespace-nowrap px-4 py-3.5 text-ink/70">
                        {r.type && typeLabel(r.type)}
                        {r.credits && ` (${r.credits})`}
                      </td>
                      <td className="px-4 py-3.5 text-ink/80">
                        {r.courses ?? r.condition ?? t.empty}
                        {r.courses && r.condition && (
                          <span className="mt-1 block text-xs text-ink/50">{r.condition}</span>
                        )}
                        {r.note && <span className="mt-1 block text-xs text-ink/45">{r.note}</span>}
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}
          {totalLabel && (
            <tr className="border-t border-line bg-surface-muted/60">
              <td colSpan={2} className="px-4 py-3.5 font-display text-ink">
                {t.total}
              </td>
              <td className="px-4 py-3.5 font-display text-base font-bold text-primary">{totalLabel}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-3 text-xs text-ink/45">
        {lang === "ko"
          ? "학부대학·학사팀 공개 자료를 기준으로 정리했습니다. 과목명이 바뀌었거나 목록에 없는 과목은 실제와 다를 수 있으니, 정확한 인정 여부는 학사팀에 확인하세요."
          : "Compiled from the College of Liberal Arts and Academic Affairs' published records. Category and course names are shown in Korean where no official English term exists, to avoid mistranslating requirements — confirm exact credit recognition with the Academic Affairs team."}
      </p>
    </div>
  );
}
