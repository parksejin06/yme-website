"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Collapse from "@/components/ui/Collapse";
import { groupHistoryByRange, type HistoryEntry } from "@/lib/history";
import historySummaries from "@/data/historyRangeSummaries.json";
import type { Lang } from "@/lib/nav";

const DEFAULT_SUMMARY = {
  kr: "이 시기의 주요 연혁입니다.",
  en: "Key milestones from this period.",
};

export default function HistoryAccordion({
  entries,
  lang,
  windowSize = 5,
}: {
  entries: HistoryEntry[];
  lang: Lang;
  windowSize?: number;
}) {
  const groups = groupHistoryByRange(entries, windowSize);
  const [openKey, setOpenKey] = useState<string | null>(groups[0]?.key ?? null);
  const summaries = historySummaries as unknown as Record<string, { kr: string; en: string }>;

  return (
    <div className="divide-y divide-line border-y border-line">
      {groups.map((group) => {
        const isOpen = openKey === group.key;
        const summary = summaries[group.key] ?? DEFAULT_SUMMARY;

        return (
          <div key={group.key}>
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : group.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
            >
              <div className="min-w-0">
                <p
                  className={`font-display text-2xl font-bold transition-colors sm:text-3xl ${
                    isOpen ? "text-primary" : "text-ink/70"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {group.endYear}~{group.startYear}
                </p>
                <p className={`mt-1.5 text-sm transition-colors ${isOpen ? "text-primary/80" : "text-ink/50"}`}>
                  {lang === "ko" ? summary.kr : summary.en}
                </p>
              </div>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isOpen ? "border-primary text-primary" : "border-line text-ink/40"
                }`}
                aria-hidden="true"
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <Collapse open={isOpen}>
              <ul className="space-y-4 pb-7 pl-1 sm:pl-2">
                {group.items.map((item) => (
                  <li key={item.year + item.month} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                    <p
                      className="shrink-0 font-display text-sm text-ink/50 sm:w-24"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {item.year}.{item.month}
                    </p>
                    <p className="text-sm text-ink/80">{lang === "ko" ? item.kr : item.en}</p>
                  </li>
                ))}
              </ul>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
}
