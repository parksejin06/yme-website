// Imports the official 기계공학부 calendar. The live 일정 page (me.yonsei.ac.kr/me/calender_main.do)
// is just a Google Calendar embed of calendar ID 0nevledgmf1pgvjsc57sp2tdik@group.calendar.google.com.
// We pull that calendar's public iCal export directly -- same data the embed shows, no bypass, no auth.
import fs from "node:fs/promises";
import path from "node:path";

const ICS_URL =
  "https://calendar.google.com/calendar/ical/0nevledgmf1pgvjsc57sp2tdik%40group.calendar.google.com/public/basic.ics";
const SOURCE_PAGE = "https://me.yonsei.ac.kr/me/calender_main.do";
const OUT = path.resolve("data/community/calendar-official.json");

function unfold(text) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

function parseIcsDate(v) {
  // v is like 20221222T073000Z (UTC) or 20221222 (all-day, DATE value)
  if (/^\d{8}$/.test(v)) {
    const y = v.slice(0, 4), m = v.slice(4, 6), d = v.slice(6, 8);
    return { iso: `${y}-${m}-${d}`, allDay: true };
  }
  const y = v.slice(0, 4), mo = v.slice(4, 6), d = v.slice(6, 8);
  const h = v.slice(9, 11), mi = v.slice(11, 13), s = v.slice(13, 15);
  const utc = v.endsWith("Z");
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}${utc ? "Z" : ""}`;
  return { iso, allDay: false };
}

function unescapeIcsText(v) {
  return v.replace(/\\n/g, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}

function guessType(summary) {
  if (/^\s*BK\s*세미나/i.test(summary)) return "BK세미나";
  if (/^\s*학부\s*세미나/.test(summary)) return "학부 세미나";
  if (/^\s*대학원\s*세미나/.test(summary)) return "대학원 세미나";
  if (/^\s*\[세미나\]/.test(summary) || /세미나/.test(summary)) return "세미나";
  if (/^\s*\[행사\]/.test(summary) || /행사/.test(summary)) return "행사";
  return "일정";
}

async function main() {
  const res = await fetch(ICS_URL, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`ICS fetch failed: HTTP ${res.status}`);
  const raw = unfold(await res.text());

  const blocks = raw.split("BEGIN:VEVENT").slice(1);
  const events = [];
  const errors = [];

  for (const block of blocks) {
    const body = block.split("END:VEVENT")[0];
    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
    const fields = {};
    for (const line of lines) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const rawKey = line.slice(0, idx);
      const key = rawKey.split(";")[0];
      const value = line.slice(idx + 1);
      fields[key] = value;
    }
    if (!fields.SUMMARY || !fields.DTSTART) {
      errors.push({ stage: "missing-fields", fields });
      continue;
    }
    try {
      const summary = unescapeIcsText(fields.SUMMARY);
      const start = parseIcsDate(fields.DTSTART);
      const end = fields.DTEND ? parseIcsDate(fields.DTEND) : null;
      events.push({
        uid: fields.UID || null,
        summary,
        eventType: guessType(summary),
        start: start.iso,
        end: end ? end.iso : null,
        allDay: start.allDay,
        status: fields.STATUS || null,
      });
    } catch (err) {
      errors.push({ stage: "parse", uid: fields.UID, error: String(err?.message || err) });
    }
  }

  events.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(
    OUT,
    JSON.stringify(
      {
        sourceUrl: SOURCE_PAGE,
        icsUrl: ICS_URL,
        importedAt: new Date().toISOString(),
        totalEvents: events.length,
        errors,
        events,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`Imported ${events.length} calendar events (${errors.length} skipped/errors) -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
