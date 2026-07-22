"use client";

import Image from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import TabRow from "@/components/ui/TabRow";
import { RESEARCH_FIELDS, fieldLabel } from "@/lib/labs";
import type { Lang } from "@/lib/nav";

const ALL_LABEL = { ko: "전체보기", en: "All Fields" };

export default function FieldSelector({
  lang,
  active,
  onSelect,
}: {
  lang: Lang;
  active: string;
  onSelect: (field: string) => void;
}) {
  const activeField = active === "all" ? null : RESEARCH_FIELDS.find((f) => f.key === active) ?? null;

  return (
    <LayoutGroup>
      {activeField ? (
        <div>
          <motion.button
            key={activeField.key}
            layoutId={`field-${activeField.key}`}
            type="button"
            onClick={() => onSelect(activeField.key)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-pressed={true}
            className="relative block h-56 w-full overflow-hidden text-left sm:h-72"
          >
            <Image
              src={activeField.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="text-balance font-display text-2xl font-bold text-white sm:text-4xl">
                {fieldLabel(activeField.key, lang)}
              </p>
            </div>
          </motion.button>

          <div className="mt-5">
            <TabRow
              ariaLabel={lang === "ko" ? "연구분야" : "Research fields"}
              value={activeField.key}
              onChange={onSelect}
              items={[
                { value: "all", label: ALL_LABEL[lang] },
                ...RESEARCH_FIELDS.map((field) => ({ value: field.key, label: fieldLabel(field.key, lang) })),
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {RESEARCH_FIELDS.map((field, i) => (
            <ScrollReveal key={field.key} delayMs={i * 90}>
              <motion.button
                layoutId={`field-${field.key}`}
                type="button"
                onClick={() => onSelect(field.key)}
                aria-pressed={false}
                className="group relative block h-36 w-full overflow-hidden text-left sm:h-48"
              >
                <Image
                  src={field.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-opacity duration-300 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="text-balance font-display text-sm font-bold text-white sm:text-base">
                    {fieldLabel(field.key, lang)}
                  </p>
                </div>
              </motion.button>
            </ScrollReveal>
          ))}
        </div>
      )}
    </LayoutGroup>
  );
}
