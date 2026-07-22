import type { Lang } from "@/lib/academics";

export interface GradSummary {
  liberalArtsBasic: string | null;
  universityLiberalElective: string | null;
  universityLiberalRequired: string | null;
  basicEducation: string | null;
  majorBasic: string | null;
  majorRequired: string | null;
  majorElective: string | null;
  majorTotal: string | null;
  graduationTotal: string | null;
  upperLevelCredit: string | null;
  designCredit: string | null;
  rcRequirement: string | null;
  chapelRequirement: string | null;
}

const LABELS: Record<keyof GradSummary, { ko: string; en: string }> = {
  liberalArtsBasic: { ko: "교양기초", en: "Basic Liberal Arts" },
  universityLiberalElective: { ko: "대학교양(선택)", en: "University Liberal Arts (Elective)" },
  universityLiberalRequired: { ko: "대학교양(필수)", en: "University Liberal Arts (Required)" },
  basicEducation: { ko: "기초교육", en: "Basic Education" },
  majorBasic: { ko: "전공기초", en: "Major Basic" },
  majorRequired: { ko: "전공필수", en: "Major Required" },
  majorElective: { ko: "전공선택", en: "Major Elective" },
  majorTotal: { ko: "전공 소계", en: "Major Subtotal" },
  graduationTotal: { ko: "총 졸업 이수학점", en: "Total Credits to Graduate" },
  upperLevelCredit: { ko: "3000/4000단위 최소이수학점", en: "Min. 3000/4000-level Credits" },
  designCredit: { ko: "설계학점요건", en: "Design Credit Requirement" },
  rcRequirement: { ko: "RC 이수요건", en: "RC Requirement" },
  chapelRequirement: { ko: "채플 요건", en: "Chapel Requirement" },
};

const FIELD_ORDER: (keyof GradSummary)[] = [
  "liberalArtsBasic",
  "universityLiberalElective",
  "universityLiberalRequired",
  "basicEducation",
  "majorBasic",
  "majorRequired",
  "majorElective",
  "majorTotal",
  "graduationTotal",
  "upperLevelCredit",
  "designCredit",
  "rcRequirement",
  "chapelRequirement",
];

export default function GraduationSummary({ summary, lang }: { summary: GradSummary; lang: Lang }) {
  const fields = FIELD_ORDER.filter((k) => summary[k] != null);
  const mid = Math.ceil(fields.length / 2);
  const columns = [fields.slice(0, mid), fields.slice(mid)];

  return (
    <div className="grid gap-x-10 sm:grid-cols-2">
      {columns.map((col, i) => (
        <dl key={i} className="divide-y divide-line border-t border-line sm:border-t-0 sm:first:border-t">
          {col.map((k) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
              <dt className="text-sm text-ink/60">{LABELS[k][lang]}</dt>
              <dd className="text-right font-display text-base font-bold text-primary">{summary[k]}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}
