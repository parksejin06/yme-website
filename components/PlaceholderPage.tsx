import type { Lang } from "@/lib/nav";

export default function PlaceholderPage({ lang, sections }: { lang: Lang; sections: string[] }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s} className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="font-display text-ink/70">{s}</p>
            <p className="mt-2 text-sm text-ink/70">
              {lang === "ko" ? "[추후 제공 예정]" : "[Content to be provided]"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
