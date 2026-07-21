# Content Sources — 뉴스 및 공지사항 / 대학원 연구실 소개 자료 및 영상

All content in `/news/*` and `/graduate/lab-media` is imported verbatim from the live
연세대학교 기계공학부 공식 홈페이지 (`me.yonsei.ac.kr`) by the scripts in `scripts/`. Nothing in
this section is hand-authored or AI-summarized. Re-run the importers with:

```
node scripts/scrape-community.mjs        # all 10 community boards
node scripts/scrape-community.mjs news   # a single board
node scripts/scrape-calendar.mjs         # official calendar (Google Calendar iCal export)
node scripts/scrape-lab-media.mjs        # graduate lab video/photo directory
```

## Community boards

| Board | Source URL | Imported | Attachments | Content images | Errors |
|---|---|---|---|---|---|
| 학부 공지사항 | `me.yonsei.ac.kr/me/community/notice.do` | 151 | 178 | 69 | 0 |
| 대학원 공지사항 | `me.yonsei.ac.kr/me/community/notice2.do` | 151 | 194 | 27 | 5 |
| 외부기관 공지사항 | `me.yonsei.ac.kr/me/community/notice3.do` | 100 | 46 | 20 | 12 |
| 장학생 선발공고 | `me.yonsei.ac.kr/me/community/notice4.do` | 101 | 106 | 2 | 0 |
| 뉴스 | `me.yonsei.ac.kr/me/community/news.do` | 150 | 272 | 163 | 0 |
| 학위논문심사 | `me.yonsei.ac.kr/me/community/degree_thesis_review.do` | 100 | 0 | 99 | 0 |
| 자료실 | `me.yonsei.ac.kr/me/community/information.do` | 7 (all) | 12 | 0 | 0 |
| 취업정보 | `me.yonsei.ac.kr/me/community/job.do` | 150 | 164 | 112 | 0 |
| 행사 | `me.yonsei.ac.kr/me/community/seminar_graduate1.do` | 39 (all) | 38 | 42 | 0 |
| 세미나 | `me.yonsei.ac.kr/me/community/seminar.do` | 150 | 147 | 2 | 0 |

**Total: 1,099 posts, 1,157 attachments downloaded, 536 content images downloaded, 17 download
errors** (logged per-post in `data/community/_import-report.json`; almost all are individual
attachment/image URLs on the official site that returned a non-200 response at import time even
after 3 retries with backoff — the post itself still imported with its real title/author/date/body,
just without that one file).

Some post bodies embed pasted screenshots as inline base64 `data:` images directly in the CMS HTML
rather than an uploaded file URL. These are decoded and saved as real local image files (not
hotlinked, not left as multi-megabyte base64 blobs inside the JSON/page payload) — 21 such images
across 5 boards.

자료실 and 행사 import **all** posts that exist on the official boards (7 and 39 respectively — the
entire board). Every other board imports its most recent 100–151 posts, exceeding the user's
stated minimums (50 for most boards, 100 for 세미나).

Import method: `scripts/lib/yonsei-board.mjs` fetches each board's list page with a raised
`articleLimit` query param (the CMS returns as many rows as asked for in one response — no
pagination loop was needed), then fetches every linked detail page. Title/author/date always come
from the detail page's own `제목`/`작성자`/`작성일` fields — never from list-view text, which
sometimes carries a decorative suffix the official detail page doesn't have (e.g. 뉴스 list titles
carry the date; the real title on the detail page doesn't). `excerpt` is `plainText.slice(0, 140)` —
a mechanical slice, never an AI summary. Post bodies are sanitized once at import time
(`sanitize-html`, fixed tag/attribute allow-list) and stored pre-sanitized in the JSON.

## Calendar

Source: `me.yonsei.ac.kr/me/calender_main.do`, which is a Google Calendar embed
(`calendar ID 0nevledgmf1pgvjsc57sp2tdik@group.calendar.google.com`). We fetch that calendar's
public iCal export directly — the same data the embed renders, no bypass.

- **413 events imported, 0 errors.**
- Times are converted UTC → KST with a fixed +9h offset (the calendar's own `X-WR-TIMEZONE` is
  `Asia/Seoul`).
- `eventType` (BK세미나/학부 세미나/대학원 세미나/세미나/행사/일정) is parsed from a literal prefix
  already present in the official event's summary text — not inferred.
- An event links to an internal post detail page only when the calendar summary and a post title
  match after whitespace-normalization (substring match, either direction). This is intentionally
  conservative: 세미나/행사 board titles carry extra detail (date, institution, talk title in
  quotes) the calendar summary doesn't, so many real events end up with no link rather than a
  guessed one. That is the expected, correct outcome, not a bug.

## Graduate lab media

Source: `me.yonsei.ac.kr/me/graduate/labs.do`. That page renders nothing server-side for this
section — it calls a Google Apps Script Web App JSON endpoint client-side
(`script.google.com/macros/s/AKfycbxHrcj6.../exec`), visible in the page's inline `<script>`. We
call that same endpoint directly.

- **33 professors have promotional media configured on the official spreadsheet; 27 have a working
  video or a working image after reachability checks** (the other 6 rows have neither field
  populated).
- **19 have a functioning video** (14 YouTube, 5 Google Drive); 17 of those 19 have a working
  thumbnail (2 Drive thumbnails are unreachable via Drive's public thumbnail endpoint — the video
  itself still plays, just without a preview image).
- **26 of the 27 also have a "연구실 홍보 이미지" field set, but every one of those 26 URLs
  (`me.yonsei.ac.kr/_res/me/img/research/*.png`) currently 404s on the official site itself** — the
  images were removed from the CMS but the spreadsheet rows referencing them were not updated.
  These are **not shown as broken images**; the card falls back to a neutral, non-human, lab-name-only
  placeholder, per the anti-fabrication requirement.
- The official page also links to a single combined "대학원 연구실 소개 자료" PDF
  (`devcms.yonsei.ac.kr/cms/resFileDownload.do?...fileName=labs.pdf`) — that URL is also broken
  (403 / CMS "page not found") on the live site, so it is not surfaced anywhere in the new page
  either; there is no working document/PDF media type in the current official data.
- `matchedFacultySlug` links a card to `/faculty/:slug` only on an exact name match against
  `data/faculty.json` — no fuzzy matching.

## Manifest

`content-source-manifest.json` is the machine-readable counterpart to this file — same numbers,
structured for programmatic verification.
