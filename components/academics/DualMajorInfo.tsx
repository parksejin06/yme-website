import type { Lang } from "@/lib/academics";

export interface DualMajorRow {
  appliesTo: string;
  category: string;
  majorRequiredCredit: string | number | null;
  majorElectiveCredit: string | number | null;
  majorTotalCredit: string | number | null;
  requiredCourses: string | null;
  otherConditions: string | null;
}

export default function DualMajorInfo({ rows, lang }: { rows: DualMajorRow[]; lang: Lang }) {
  const t = {
    ko: {
      title: "복수전공·부전공 안내",
      desc: "학번과 관계없이 공통으로 적용되는 복수전공(이중전공)·부전공 이수 기준입니다.",
      required: "전공필수",
      elective: "전공선택",
      total: "총 전공학점",
      credits: "학점",
    },
    en: {
      title: "Double Major & Minor Guide",
      desc: "Double-major and minor completion criteria that apply regardless of cohort year.",
      required: "Major Required",
      elective: "Major Elective",
      total: "Total Major Credits",
      credits: "credits",
    },
  }[lang];

  return (
    <div>
      <h2 className="font-display text-xl text-ink">{t.title}</h2>
      <p className="mt-2 text-sm text-ink/70">{t.desc}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {rows.map((r, i) => (
          <div key={i} className="rounded-lg border border-line p-4">
            <p className="font-display text-sm text-ink">{r.category}</p>
            <p className="text-xs text-ink/50">{r.appliesTo}</p>
            {(r.majorRequiredCredit != null || r.majorElectiveCredit != null || r.majorTotalCredit != null) && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
                {r.majorRequiredCredit != null && (
                  <span>
                    {t.required} {r.majorRequiredCredit}
                    {t.credits}
                  </span>
                )}
                {r.majorElectiveCredit != null && (
                  <span>
                    {t.elective} {r.majorElectiveCredit}
                    {t.credits}
                  </span>
                )}
                {r.majorTotalCredit != null && (
                  <span className="font-semibold text-primary">
                    {t.total} {r.majorTotalCredit}
                    {t.credits}
                  </span>
                )}
              </div>
            )}
            {r.requiredCourses && <p className="mt-2 text-sm text-ink/70">{r.requiredCourses}</p>}
            {r.otherConditions && <p className="mt-1 text-sm text-ink/70">{r.otherConditions}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
