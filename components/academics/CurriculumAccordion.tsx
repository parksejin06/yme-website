import { BUCKETS, CATEGORY_COLORS, type Lang } from "@/lib/academics";

export interface CurriculumEntry {
  courseId: string;
  courseCode: string;
  nameKr: string;
  nameEn: string | null;
  bucket: string;
  courseType: string;
  credit: number;
  category: string;
  researchArea: string | null;
  dataNote: string | null;
}

export interface CourseDetail {
  courseCode: string;
  description: string | null;
  hasDetail: boolean;
  keywords: string | null;
  relatedCourses: string | null;
}

const COPY = {
  ko: {
    banner: "※ 아래 커리큘럼은 참고용 공통 편성표이며, 학번별로 세부 편성이 다를 수 있습니다.",
    courses: "개 과목",
    noDetail: "상세 설명 준비 중",
    keywords: "핵심 키워드",
    related: "관련 교과목",
  },
  en: {
    banner: "※ The curriculum below is a common reference plan; actual course offerings may vary by cohort year.",
    courses: " courses",
    noDetail: "Detailed description coming soon",
    keywords: "Keywords",
    related: "Related Courses",
  },
};

export default function CurriculumAccordion({
  entries,
  courseMap,
  lang,
}: {
  entries: CurriculumEntry[];
  courseMap: Map<string, CourseDetail>;
  lang: Lang;
}) {
  const t = COPY[lang];

  return (
    <div>
      <p className="rounded-md bg-surface-muted px-4 py-3 text-sm text-ink/70">{t.banner}</p>

      <div className="mt-6 space-y-3">
        {BUCKETS.map((bucket) => {
          const courses = entries
            .filter((e) => e.bucket === bucket.key)
            .sort((a, b) => a.courseId.localeCompare(b.courseId));
          if (courses.length === 0) return null;

          return (
            <details key={bucket.key} className="rounded-lg border border-line open:shadow-sm">
              <summary className="cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-ink">{lang === "ko" ? bucket.labelKr : bucket.labelEn}</span>
                <span className="ml-2 text-sm text-ink/50">
                  {courses.length}
                  {t.courses}
                </span>
              </summary>
              <div className="grid gap-2 border-t border-line p-5 sm:grid-cols-2">
                {courses.map((c) => {
                  const detail = courseMap.get(c.courseCode);
                  const colorClass = CATEGORY_COLORS[c.category] ?? "bg-slate-100 text-slate-700 border-slate-300";
                  return (
                    <details key={`${c.courseId}-${bucket.key}`} className={`rounded-md border ${colorClass}`}>
                      <summary className="cursor-pointer list-none px-3 py-2 text-sm [&::-webkit-details-marker]:hidden">
                        {lang === "ko" ? c.nameKr : c.nameEn ?? c.nameKr}
                        <span className="ml-1.5 opacity-70">
                          ({c.credit}
                          {lang === "ko" ? "학점" : "cr"})
                        </span>
                      </summary>
                      <div className="border-t border-current/20 px-3 py-2.5 text-sm text-ink/80">
                        <p>{detail?.hasDetail ? detail.description : t.noDetail}</p>
                        {detail?.keywords && (
                          <p className="mt-1.5 text-xs text-ink/50">
                            {t.keywords}: {detail.keywords}
                          </p>
                        )}
                        {detail?.relatedCourses && (
                          <p className="mt-1 text-xs text-ink/50">
                            {t.related}: {detail.relatedCourses}
                          </p>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
