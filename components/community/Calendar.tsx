"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { CALENDAR_TYPE_META, calendarTypeLabel, type CalendarEvent, type CalendarEventType } from "@/lib/community";
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
    location: "장소",
    contact: "문의처",
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
    location: "Location",
    contact: "Contact",
  },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function eventsOnDate(events: CalendarEvent[], dateKey: string) {
  return events.filter((e) => e.startDate <= dateKey && dateKey <= e.endDate);
}

function EventDot({ type }: { type: CalendarEventType }) {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CALENDAR_TYPE_META[type].color }} />;
}

function EventListView({
  events,
  noEventsLabel,
  onSelect,
}: {
  events: CalendarEvent[];
  noEventsLabel: string;
  onSelect: (e: CalendarEvent) => void;
}) {
  if (events.length === 0) {
    return <p className="py-10 text-center text-sm text-ink/40">{noEventsLabel}</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {[...events]
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .map((e) => (
          <li key={e.id}>
            <button
              onClick={() => onSelect(e)}
              className="flex min-h-11 w-full items-center gap-3 py-3.5 text-left hover:bg-surface-muted/60 sm:gap-4"
            >
              <span className="w-20 shrink-0 text-xs text-ink/50 sm:w-24">
                {e.startDate}
                {e.endDate !== e.startDate ? ` ~ ${e.endDate}` : ""}
              </span>
              <EventDot type={e.type} />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{e.title}</span>
            </button>
          </li>
        ))}
    </ul>
  );
}

export default function Calendar({ events, lang }: { events: CalendarEvent[]; lang: Lang }) {
  const t = COPY[lang];
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | "all">("all");
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = useMemo(
    () => (typeFilter === "all" ? events : events.filter((e) => e.type === typeFilter)),
    [events, typeFilter]
  );

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

  const dayEvents = selectedDay ? eventsOnDate(filteredEvents, selectedDay) : [];

  return (
    <div>
      {/* Header: month nav + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            aria-label={lang === "ko" ? "이전 달" : "Previous month"}
            className="flex h-9 w-9 items-center justify-center rounded border border-line text-ink/60 hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="w-40 text-center font-display text-base text-ink">{monthLabel}</p>
          <button
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            aria-label={lang === "ko" ? "다음 달" : "Next month"}
            className="flex h-9 w-9 items-center justify-center rounded border border-line text-ink/60 hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="ml-1 min-h-9 rounded-full border border-line px-3 text-xs font-medium text-ink/70 hover:border-primary hover:text-primary"
          >
            {t.today}
          </button>
        </div>

        <div className="inline-flex rounded-md border border-line p-0.5">
          <button
            onClick={() => setView("month")}
            aria-pressed={view === "month"}
            className={`flex min-h-9 items-center gap-1.5 rounded px-3 text-xs font-medium ${view === "month" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> {t.month}
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex min-h-9 items-center gap-1.5 rounded px-3 text-xs font-medium ${view === "list" ? "bg-primary-strong text-white" : "text-ink/60"}`}
          >
            <List className="h-3.5 w-3.5" /> {t.list}
          </button>
        </div>
      </div>

      {/* Type filter */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setTypeFilter("all")}
          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 text-xs font-medium ${typeFilter === "all" ? "border-primary bg-primary text-white" : "border-line text-ink/60 hover:border-primary-soft hover:text-primary"}`}
        >
          {t.all}
        </button>
        {(Object.keys(CALENDAR_TYPE_META) as CalendarEventType[]).map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
              typeFilter === type ? "text-white" : "border-line text-ink/60 hover:border-primary-soft"
            }`}
            style={typeFilter === type ? { backgroundColor: CALENDAR_TYPE_META[type].color, borderColor: CALENDAR_TYPE_META[type].color } : undefined}
          >
            <EventDot type={type} />
            {calendarTypeLabel(type, lang)}
          </button>
        ))}
      </div>

      {/* Month view (hidden on mobile unless explicitly toggled to it isn't needed since mobile always shows list per design) */}
      {view === "month" ? (
        <div className="mt-6 hidden sm:block">
          <div className="grid grid-cols-7 border-b border-line text-center text-xs text-ink/45">
            {t.weekdays.map((w) => (
              <div key={w} className="py-2">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map(({ date, key, inMonth }) => {
              const dayEvts = eventsOnDate(filteredEvents, key);
              const isToday = key === todayKey;
              const visible = dayEvts.slice(0, 3);
              const overflow = dayEvts.length - visible.length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={`flex min-h-[92px] flex-col items-start gap-1 border-b border-r border-line p-1.5 text-left align-top last:border-r-0 ${
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
                  <div className="w-full space-y-0.5">
                    {visible.map((e) => (
                      <span
                        key={e.id}
                        className="block truncate rounded px-1 py-0.5 text-[10px] text-white"
                        style={{ backgroundColor: CALENDAR_TYPE_META[e.type].color }}
                      >
                        {e.title}
                      </span>
                    ))}
                    {overflow > 0 && <span className="block text-[10px] text-ink/45">{t.moreCount(overflow)}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {filteredEvents.length === 0 && <p className="mt-6 text-center text-sm text-ink/40">{t.noEventsMonth}</p>}
        </div>
      ) : null}

      {/* List view: desktop only when "list" selected via toggle */}
      {view === "list" && (
        <div className="mt-6 hidden sm:block">
          <EventListView events={filteredEvents} noEventsLabel={t.noEventsList} onSelect={setSelectedEvent} />
        </div>
      )}

      {/* Mobile: always a list (there's no month grid on mobile regardless of the view toggle) */}
      <div className="mt-6 sm:hidden">
        <EventListView events={filteredEvents} noEventsLabel={t.noEventsList} onSelect={setSelectedEvent} />
      </div>

      {/* Day detail (from month-grid date click) */}
      <Modal open={!!selectedDay} onClose={() => setSelectedDay(null)} panelClassName="max-w-sm">
        {selectedDay && (
          <div className="p-6">
            <h3 className="font-display text-lg text-ink">{selectedDay}</h3>
            {dayEvents.length === 0 ? (
              <p className="mt-4 text-sm text-ink/40">{t.noEventsDay}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {dayEvents.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => {
                        setSelectedDay(null);
                        setSelectedEvent(e);
                      }}
                      className="flex w-full items-center gap-2 rounded-md border border-line px-3 py-2.5 text-left text-sm hover:border-primary-soft"
                    >
                      <EventDot type={e.type} />
                      <span className="min-w-0 flex-1 truncate">{e.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>

      {/* Event detail */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} panelClassName="max-w-sm">
        {selectedEvent && (
          <div className="p-6">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
              style={{ backgroundColor: CALENDAR_TYPE_META[selectedEvent.type].color }}
            >
              {calendarTypeLabel(selectedEvent.type, lang)}
            </span>
            <h3 className="mt-3 font-display text-lg text-ink">{selectedEvent.title}</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/40">{lang === "ko" ? "일시" : "Date"}</dt>
                <dd className="text-ink/80">
                  {selectedEvent.startDate}
                  {selectedEvent.endDate !== selectedEvent.startDate ? ` ~ ${selectedEvent.endDate}` : ""}
                  {selectedEvent.startTime ? ` ${selectedEvent.startTime}${selectedEvent.endTime ? `–${selectedEvent.endTime}` : ""}` : ""}
                </dd>
              </div>
              {selectedEvent.location && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-ink/40">{t.location}</dt>
                  <dd className="text-ink/80">{selectedEvent.location}</dd>
                </div>
              )}
              {selectedEvent.description && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-ink/40">{lang === "ko" ? "설명" : "Info"}</dt>
                  <dd className="text-ink/80">{selectedEvent.description}</dd>
                </div>
              )}
              {selectedEvent.contact && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-ink/40">{t.contact}</dt>
                  <dd className="text-ink/80">{selectedEvent.contact}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
