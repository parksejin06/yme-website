import type { Lang } from "@/lib/nav";

export interface ThesisReview {
  id: number;
  category: string; // 구분: e.g. "예비심사", "본심사"
  program: "master" | "phd" | "integrated";
  title: string;
  targetSemester: string;
  periodStart: string | null;
  periodEnd: string | null;
  postedDate: string;
  procedure: string | null;
  documents: string | null;
  contact: string | null;
  attachment: string | null;
}

export interface Resource {
  id: number;
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
  registeredDate: string;
  filePath: string;
  description: string | null;
}

export interface JobPosting {
  id: number;
  company: string;
  title: string;
  type: string; // 신입/인턴/연구직/대학원 진학·연구기회
  target: string | null;
  applyStart: string | null;
  applyEnd: string;
  postedDate: string;
  link: string | null;
  attachment: string | null;
}

export interface CommunityEvent {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  target: string | null;
  program: string | null;
  applyMethod: string | null;
  relatedMaterial: string | null;
}

export interface Seminar {
  id: number;
  title: string;
  speaker: string;
  affiliation: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  field: string | null;
  abstract: string | null;
  postedDate: string;
}

export const PROGRAM_LABEL: Record<ThesisReview["program"], { ko: string; en: string }> = {
  master: { ko: "석사", en: "Master's" },
  phd: { ko: "박사", en: "Doctoral" },
  integrated: { ko: "석·박사 통합", en: "Combined" },
};

export const SEMINAR_FIELDS = [
  "역학·재료",
  "열·유체·에너지",
  "제어·로봇",
  "설계·생산",
  "마이크로·나노",
  "바이오·융합",
] as const;

export type CalendarEventType = "academic" | "thesis" | "event" | "seminar" | "job";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, same as startDate for single-day events
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  contact: string | null;
  relatedPath: string | null;
}

export const CALENDAR_TYPE_META: Record<CalendarEventType, { labelKr: string; labelEn: string; color: string }> = {
  academic: { labelKr: "학사", labelEn: "Academic", color: "#183d7a" },
  thesis: { labelKr: "학위논문", labelEn: "Thesis", color: "#6a5a86" },
  event: { labelKr: "행사", labelEn: "Event", color: "#4f7a5c" },
  seminar: { labelKr: "세미나", labelEn: "Seminar", color: "#3f7268" },
  job: { labelKr: "취업", labelEn: "Jobs", color: "#a07d3a" },
};

export function calendarTypeLabel(type: CalendarEventType, lang: Lang): string {
  return lang === "ko" ? CALENDAR_TYPE_META[type].labelKr : CALENDAR_TYPE_META[type].labelEn;
}

/** Derives calendar entries from each content type's own dates, rather than maintaining a
 * separately hand-synced events list — a thesis-review posting's period, a seminar's date, a
 * job's deadline, and an event's date range are each the single source of truth for their own
 * calendar entry. Currently returns [] because every source array is empty (no fabricated data). */
export function buildCalendarEvents(sources: {
  thesisReviews: ThesisReview[];
  events: CommunityEvent[];
  seminars: Seminar[];
  jobs: JobPosting[];
}): CalendarEvent[] {
  const out: CalendarEvent[] = [];

  for (const t of sources.thesisReviews) {
    if (!t.periodStart) continue;
    out.push({
      id: `thesis-${t.id}`,
      type: "thesis",
      title: t.title,
      startDate: t.periodStart,
      endDate: t.periodEnd ?? t.periodStart,
      startTime: null,
      endTime: null,
      location: null,
      description: t.category,
      contact: t.contact,
      relatedPath: `/news/thesis-review/${t.id}`,
    });
  }

  for (const e of sources.events) {
    out.push({
      id: `event-${e.id}`,
      type: "event",
      title: e.title,
      startDate: e.startDate,
      endDate: e.endDate ?? e.startDate,
      startTime: null,
      endTime: null,
      location: e.location,
      description: e.type,
      contact: null,
      relatedPath: `/news/events/${e.id}`,
    });
  }

  for (const s of sources.seminars) {
    out.push({
      id: `seminar-${s.id}`,
      type: "seminar",
      title: s.title,
      startDate: s.date,
      endDate: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location,
      description: `${s.speaker}${s.affiliation ? ` (${s.affiliation})` : ""}`,
      contact: null,
      relatedPath: `/news/seminars/${s.id}`,
    });
  }

  for (const j of sources.jobs) {
    out.push({
      id: `job-${j.id}`,
      type: "job",
      title: `${j.company} · ${j.title} 마감`,
      startDate: j.applyEnd,
      endDate: j.applyEnd,
      startTime: null,
      endTime: null,
      location: null,
      description: null,
      contact: null,
      relatedPath: `/news/jobs`,
    });
  }

  return out;
}
