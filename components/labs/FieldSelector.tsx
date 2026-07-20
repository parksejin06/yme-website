import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { RESEARCH_FIELDS, fieldLabel } from "@/lib/labs";
import type { Lang } from "@/lib/nav";

export default function FieldSelector({
  lang,
  active,
  onSelect,
}: {
  lang: Lang;
  active: string;
  onSelect: (field: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
      {RESEARCH_FIELDS.map((field, i) => {
        const isActive = field.key === active;
        return (
          <ScrollReveal key={field.key} delayMs={i * 90}>
            <button
              type="button"
              onClick={() => onSelect(field.key)}
              aria-pressed={isActive}
              className={`group relative block h-36 w-full overflow-hidden rounded-xl text-left shadow-md transition-all duration-300 sm:h-48 ${
                isActive ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={field.image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-colors duration-300 ${
                  isActive ? "from-primary/90 via-primary/40 to-transparent" : "from-black/75 via-black/35 to-transparent"
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="text-balance font-display text-sm font-bold text-white sm:text-base">
                  {fieldLabel(field.key, lang)}
                </p>
              </div>
            </button>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
