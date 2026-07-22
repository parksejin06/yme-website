import type { Lang } from "@/lib/nav";

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  localPath: string | null;
  fileSize?: number;
}

export interface ContentImage {
  sourceUrl: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  localPath?: string | null;
}

/** One schema shared by every community board (공지 x4 / 뉴스 / 학위논문심사 / 자료실 / 취업정보 / 행사 / 세미나).
 * Populated only by scripts/scrape-community.mjs from the live me.yonsei.ac.kr board pages — nothing
 * here is hand-authored. title/author/publishedAt/originalHtml are copied verbatim from the official
 * post; excerpt is a mechanical slice of plainText, never an AI summary. */
export interface CommunityPost {
  id: string;
  sourceBoard: string;
  sourcePostId: string;
  category: string;
  title: string;
  author: string | null;
  publishedAt: string | null;
  isPinned: boolean;
  isNew: boolean;
  originalHtml: string;
  plainText: string;
  excerpt: string;
  attachments: Attachment[];
  contentImages: ContentImage[];
  sourceUrl: string;
  importedAt: string;
}

export type BoardKey =
  | "notices-undergraduate"
  | "notices-graduate"
  | "notices-external"
  | "notices-scholarship"
  | "news"
  | "thesis-reviews"
  | "resources"
  | "jobs"
  | "events"
  | "seminars";

export interface BoardMeta {
  key: BoardKey;
  labelKo: string;
  labelEn: string;
  sourceUrl: string;
  /** URL segment under /news (or /en/news) for this board's list + [id] detail route. */
  routeSegment: string;
  /** Overrides the default "/news" section root -- jobs lives under 입학·진로 (/admissions), not
   * 뉴스및공지사항, to avoid the duplicate listing the two sections used to share. */
  basePath?: string;
}

export const BOARD_META: Record<BoardKey, BoardMeta> = {
  "notices-undergraduate": {
    key: "notices-undergraduate",
    labelKo: "학부 공지사항",
    labelEn: "Undergraduate Notices",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/notice.do",
    routeSegment: "notice/undergraduate",
  },
  "notices-graduate": {
    key: "notices-graduate",
    labelKo: "대학원 공지사항",
    labelEn: "Graduate Notices",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/notice2.do",
    routeSegment: "notice/graduate",
  },
  "notices-external": {
    key: "notices-external",
    labelKo: "외부기관 공지사항",
    labelEn: "External Notices",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/notice3.do",
    routeSegment: "notice/external",
  },
  "notices-scholarship": {
    key: "notices-scholarship",
    labelKo: "장학생 선발공고",
    labelEn: "Scholarship Notices",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/notice4.do",
    routeSegment: "notice/scholarship",
  },
  news: {
    key: "news",
    labelKo: "뉴스",
    labelEn: "News",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/news.do",
    routeSegment: "research",
  },
  "thesis-reviews": {
    key: "thesis-reviews",
    labelKo: "학위논문심사",
    labelEn: "Thesis Review",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do",
    routeSegment: "thesis-review",
  },
  resources: {
    key: "resources",
    labelKo: "자료실",
    labelEn: "Resources",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/information.do",
    routeSegment: "resources",
  },
  jobs: {
    key: "jobs",
    labelKo: "채용정보·인턴십",
    labelEn: "Jobs & Internships",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/job.do",
    routeSegment: "jobs",
    basePath: "/admissions",
  },
  events: {
    key: "events",
    labelKo: "행사",
    labelEn: "Events",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do",
    routeSegment: "events",
  },
  seminars: {
    key: "seminars",
    labelKo: "세미나",
    labelEn: "Seminars",
    sourceUrl: "https://me.yonsei.ac.kr/me/community/seminar.do",
    routeSegment: "seminars",
  },
};

export const NOTICE_BOARDS = [
  "notices-undergraduate",
  "notices-graduate",
  "notices-external",
  "notices-scholarship",
] as const satisfies readonly BoardKey[];

export function boardLabel(key: BoardKey, lang: Lang): string {
  return lang === "ko" ? BOARD_META[key].labelKo : BOARD_META[key].labelEn;
}

export function postHref(lang: Lang, board: BoardKey, id: string): string {
  const prefix = lang === "ko" ? "" : "/en";
  const base = BOARD_META[board].basePath ?? "/news";
  return `${prefix}${base}/${BOARD_META[board].routeSegment}/${id}`;
}

export function listHref(lang: Lang, board: BoardKey): string {
  const prefix = lang === "ko" ? "" : "/en";
  if ((NOTICE_BOARDS as readonly BoardKey[]).includes(board)) return `${prefix}/news`;
  const base = BOARD_META[board].basePath ?? "/news";
  return `${prefix}${base}/${BOARD_META[board].routeSegment}`;
}

/** Official calendar event, imported verbatim from the public Google Calendar iCal feed embedded
 * in me.yonsei.ac.kr/me/calender_main.do. summary/start/end are exactly what the official calendar
 * shows; no field is invented (the source has no location/description for almost every entry, so we
 * don't render one). */
export interface OfficialCalendarEvent {
  uid: string | null;
  summary: string;
  eventType: string;
  start: string;
  end: string | null;
  allDay: boolean;
  status: string | null;
}

export const CALENDAR_TYPE_COLORS: Record<string, string> = {
  BK세미나: "#3f7268",
  "학부 세미나": "#4f7a5c",
  "대학원 세미나": "#3f6a9c",
  세미나: "#6a5a86",
  행사: "#a07d3a",
  일정: "#183d7a",
};

/** Pulls a literal leading "[태그]" prefix off an official title (e.g. "[BK세미나] 7/28(화) ..." ->
 * "BK세미나"). This is text that is already part of the official title -- not a category we invent. */
export function extractLeadingBracketTag(title: string): string | null {
  const m = title.match(/^\s*\[([^\]]+)\]/);
  return m ? m[1].trim() : null;
}

/** Best-effort, conservative link from an official calendar entry to an internal post we imported:
 * only links when the calendar's summary text appears verbatim inside the post's title or plain text
 * (or vice versa). No fuzzy/AI matching — an unmatched event just has no link, which is correct. */
export function findLinkedPost(summary: string, candidates: CommunityPost[]): CommunityPost | null {
  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  const target = norm(summary);
  if (target.length < 4) return null;
  for (const post of candidates) {
    const title = norm(post.title);
    if (title.includes(target) || target.includes(title)) return post;
  }
  return null;
}
