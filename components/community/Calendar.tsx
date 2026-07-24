"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, List, ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  CALENDAR_TYPE_COLORS,
  findLinkedPost,
  postHref,
  type OfficialCalendarEvent,
  type CommunityPost,
  type BoardKey,
} from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    today: "오늘",
    all: "전체",
    month: "월간",
    list: "목록",
    moreCount: (n: number) => `+${n}개 더보기`,
    noEventsMonth: "이번 달에는 등록된 일정이 없습니다.",
    noEventsList: "등록된 일정이 없습니다.",
    noEventsDay: "선택한 날짜에 일정이 없습니다.",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    relatedPost: "관련 게시글 보기",
    official: "공식 캘린더 원문",
  },
  en: {
    today: "Today",
    all: "All",
    month: "Month",
    list: "List",
    moreCount: (n: number) => `+${n} more`,
    noEventsMonth: "No events this month.",
    noEventsList: "No events scheduled.",
    noEventsDay: "No events on this date.",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    relatedPost: "View related post",
    official: "Official calendar source",
  },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
/** ICS timed values are UTC ('...Z'); the source calendar is Asia/Seoul (UTC+9), so we shift by a
 * fixed 9h to get the calendar date the official page would show -- no reliance on server TZ. */
function kstDateKey(iso: string, allDay: boolean): string {
  if (allDay) return iso;
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`;
}
function kstTime(iso: string): string {
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return `${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;
}
function typeColor(type: string): string {
  return CALENDAR_TYPE_COLORS[type] ?? "#5578ac";
}

function EventDot({ type }: { type: string }) {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: typeColor(type) }} />;
}

interface DatedEvent extends OfficialCalendarEvent {
  dateKey: string;
}

function EventListView({
  events,
  noEventsLabel,
  onSelect,
}: {
  events: DatedEvent[];
  noEventsLabel: string;
  onSelect: (e: DatedEvent) => void;
}) {
  if (events.length === 0) {
    return <p className="py-10 text-center text-sm text-ink/40">{noEventsLabel}</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {[...events]
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
        .map((e, i) => (
          <li key={`${e.uid ?? e.summary}-${i}`}>
            <button
              onClick={() => onSelect(e)}
              className="flex min-h-11 w-full items-center gap-3 py-3.5 text-left hover:bg-surface-muted/60 sm:gap-4"
            >
              <span className="w-20 shrink-0 text-xs text-ink/50 sm:w-24">{e.dateKey}</span>
              <EventDot type={e.eventType} />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{e.summary}</span>
            </button>
          </li>
        ))}
    </ul>
  );
}

export default function Calendar({
  events,
  relatedPosts,
  lang,
}: {
  events: OfficialCalendarEvent[];
  relatedPosts: { board: BoardKey; post: CommunityPost }[];
  lang: Lang;
}) {
  const t = COPY[lang];
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DatedEvent | null>(null);

  const datedEvents = useMemo<DatedEvent[]>(
    () => events.map((e) => ({ ...e, dateKey: kstDateKey(e.start, e.allDay) })),
    [events]
  );

  const types = useMemo(() => Array.from(new Set(datedEvents.map((e) => e.eventType))), [datedEvents]);

  const filteredEvents = useMemo(
    () => (typeFilter === "all" ? datedEvents : datedEvents.filter((e) => e.eventType === typeFilter)),
    [datedEvents, typeFilter]
  );

  const eventsOnDate = (dateKey: string) => filteredEvents.filter((e) => e.dateKey === dateKey);

  const todayKey = toDateKey(today);

  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const date = new Date(year, month, 1 - startOffset + i);
      return { date, key: toDateKey(date), inMonth: date.getMonth() === month };
    });
  }, [viewDate]);

  const monthLabel =
    lang === "ko"
      ? `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`
      : viewDate.toLocaleDateString("en-US", { year: "numeric", month: "long" });

  const dayEvents = selectedDay ? eventsOnDate(selectedDay) : [];
  const linked = selectedEvent
    ? (() => {
        const match = findLinkedPost(
          selectedEvent.summary,
          relatedPosts.map((r) => r.post)
        );
        if (!match) return null;
        const board = relatedPosts.find((r) => r.post.id === match.id)?.board;
        return board ? { board, post: match } : null;
      })()
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {view === "month" && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              aria-label={lang === "ko" ? "이전 달" : "Previous month"}
              className="flex h-11 w-11 items-center justify-center rounded border border-line text-ink/60 hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="w-48 text-center font-display text-xl text-ink">{monthLabel}</p>
            <button
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              aria-label={lang === "ko" ? "다음 달" : "Next month"}
              className="flex h-11 w-11 items-center justify-center rounded border border-line text-ink/60 hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="ml-1 min-h-11 rounded-md border border-line px-4 text-sm font-medium text-ink/70 hover:border-primary hover:text-primary"
            >
              {t.today}
            </button>
          </div>
        )}

        <div className="ml-auto inline-flex rounded-md border border-line p-0.5">
          <button
            onClick={() => setView("month")}
            aria-pressed={view === "month"}
            className={`flex min-h-11 items-center gap-1.5 rounded px-4 text-sm font-medium ${view === "month" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            <LayoutGrid className="h-4 w-4" /> {t.month}
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex min-h-11 items-center gap-1.5 rounded px-4 text-sm font-medium ${view === "list" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            <List className="h-4 w-4" /> {t.list}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line">
        <button
          onClick={() => setTypeFilter("all")}
          className={`-mb-px flex min-h-11 items-center border-b-[3px] px-1 text-sm font-medium transition-colors ${
            typeFilter === "all" ? "border-primary font-bold text-primary" : "border-transparent text-ink/55 hover:text-ink"
          }`}
        >
          {t.all}
        </button>
        {types.map((type) => {
          const active = typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`-mb-px flex min-h-11 items-center gap-1.5 border-b-[3px] px-1 text-sm font-medium transition-colors ${
                active ? "font-bold" : "border-transparent text-ink/55 hover:text-ink"
              }`}
              style={{ borderColor: active ? typeColor(type) : "transparent", color: active ? typeColor(type) : undefined }}
            >
              <EventDot type={type} />
              {type}
            </button>
          );
        })}
      </div>

      {view === "month" ? (
        <>
        {/* Mobile month view: compact grid with event dots -- tapping a day opens the day modal.
            (The desktop grid's text pills don't fit a phone column; dots keep 월간 usable.) */}
        <div className="mt-6 sm:hidden">
          <div className="grid grid-cols-7 border-b border-line text-center text-xs text-ink/45">
            {t.weekdays.map((w) => (
              <div key={w} className="py-2">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map(({ date, key, inMonth }) => {
              const dayEvts = eventsOnDate(key);
              const isToday = key === todayKey;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={`flex min-h-[54px] flex-col items-center gap-1 border-b border-r border-line pt-1.5 last:border-r-0 ${
                    inMonth ? "bg-white" : "bg-surface-muted/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday ? "bg-primary text-white" : inMonth ? "text-ink/70" : "text-ink/30"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <span className="flex gap-0.5">
                    {dayEvts.slice(0, 3).map((e, i) => (
                      <EventDot key={`${e.uid ?? e.summary}-${i}`} type={e.eventType} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredEvents.length === 0 && <p className="mt-6 text-center text-sm text-ink/40">{t.noEventsMonth}</p>}
        </div>

        <div className="mt-8 hidden sm:block">
          <div className="grid grid-cols-7 border-b border-line text-center text-sm text-ink/45">
            {t.weekdays.map((w) => (
              <div key={w} className="py-3">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map(({ date, key, inMonth }) => {
              const dayEvts = eventsOnDate(key);
              const isToday = key === todayKey;
              const visible = dayEvts.slice(0, 3);
              const overflow = dayEvts.length - visible.length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={`flex min-h-[128px] flex-col items-start gap-1.5 border-b border-r border-line p-2.5 text-left align-top last:border-r-0 ${
                    inMonth ? "bg-white" : "bg-surface-muted/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      isToday ? "bg-primary text-white" : inMonth ? "text-ink/70" : "text-ink/30"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="w-full space-y-1">
                    {visible.map((e, i) => (
                      <span
                        key={`${e.uid ?? e.summary}-${i}`}
                        className="block truncate rounded px-1.5 py-1 text-xs text-white"
                        style={{ backgroundColor: typeColor(e.eventType) }}
                      >
                        {e.summary}
                      </span>
                    ))}
                    {overflow > 0 && <span className="block text-xs text-ink/45">{t.moreCount(overflow)}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {filteredEvents.length === 0 && <p className="mt-6 text-center text-sm text-ink/40">{t.noEventsMonth}</p>}
        </div>
        </>
      ) : null}

      {view === "list" && (
        <div className="mt-6">
          <EventListView events={filteredEvents} noEventsLabel={t.noEventsList} onSelect={setSelectedEvent} />
        </div>
      )}

      <Modal open={!!selectedDay} onClose={() => setSelectedDay(null)} panelClassName="max-w-sm">
        {selectedDay && (
          <div className="p-6">
            <h3 className="font-display text-lg text-ink">{selectedDay}</h3>
            {dayEvents.length === 0 ? (
              <p className="mt-4 text-sm text-ink/40">{t.noEventsDay}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {dayEvents.map((e, i) => (
                  <li key={`${e.uid ?? e.summary}-${i}`}>
                    <button
                      onClick={() => {
                        setSelectedDay(null);
                        setSelectedEvent(e);
                      }}
                      className="flex w-full items-center gap-2 rounded-md border border-line px-3 py-2.5 text-left text-sm hover:border-primary-soft"
                    >
                      <EventDot type={e.eventType} />
                      <span className="min-w-0 flex-1 truncate">{e.summary}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>

      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} panelClassName="max-w-sm">
        {selectedEvent && (
          <div className="p-6">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
              style={{ backgroundColor: typeColor(selectedEvent.eventType) }}
            >
              {selectedEvent.eventType}
            </span>
            <h3 className="mt-3 font-display text-lg text-ink">{selectedEvent.summary}</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/40">{lang === "ko" ? "일시" : "Date"}</dt>
                <dd className="text-ink/80">
                  {selectedEvent.dateKey}
                  {!selectedEvent.allDay ? ` ${kstTime(selectedEvent.start)}` : ""}
                </dd>
              </div>
            </dl>
            {linked && (
              <Link
                href={postHref(lang, linked.board, linked.post.sourcePostId)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {t.relatedPost} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
