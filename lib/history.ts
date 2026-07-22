export interface HistoryEntry {
  year: string;
  month: string;
  kr: string;
  en: string;
}

export interface HistoryRange {
  key: string;
  startYear: number;
  endYear: number;
  items: HistoryEntry[];
}

/** Buckets entries into fixed-size year windows (e.g. 2020-2024, 2015-2019, ...),
 * sorted most-recent-first, with each bucket's items sorted most-recent-first. */
export function groupHistoryByRange(entries: HistoryEntry[], windowSize = 5): HistoryRange[] {
  const buckets = new Map<number, HistoryEntry[]>();

  for (const entry of entries) {
    const year = Number(entry.year);
    const startYear = Math.floor(year / windowSize) * windowSize;
    if (!buckets.has(startYear)) buckets.set(startYear, []);
    buckets.get(startYear)!.push(entry);
  }

  return Array.from(buckets.entries())
    .map(([startYear, items]) => ({
      key: `${startYear}-${startYear + windowSize - 1}`,
      startYear,
      endYear: startYear + windowSize - 1,
      items: [...items].sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`)),
    }))
    .sort((a, b) => b.startYear - a.startYear);
}
