export type Lang = "ko" | "en";

export interface NavSubItem {
  path: string;
  kr: string;
  en: string;
}

export interface NavItem {
  path: string; // path segment under the locale root, e.g. "/about"
  kr: string;
  en: string;
  children?: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: "/about",
    kr: "학부소개",
    en: "About",
    children: [
      { path: "/about", kr: "학부 개요", en: "Overview" },
      { path: "/about/vision", kr: "비전·교육목표", en: "Vision & Mission" },
      { path: "/about/history", kr: "연혁", en: "History" },
      { path: "/about/staff", kr: "교직원", en: "Staff" },
      { path: "/about/directions", kr: "오시는 길", en: "Directions" },
    ],
  },
  {
    path: "/faculty",
    kr: "교수진",
    en: "Faculty",
    children: [
      { path: "/faculty", kr: "전임교수", en: "Full-time Faculty" },
      { path: "/faculty/emeritus", kr: "명예·퇴임 교수", en: "Emeritus & Retired Faculty" },
    ],
  },
  {
    path: "/undergraduate",
    kr: "학부",
    en: "Undergraduate",
    children: [
      { path: "/undergraduate/graduation", kr: "졸업 요건", en: "Graduation Requirements" },
      { path: "/undergraduate/graduation-check", kr: "졸업요건 자가진단", en: "Graduation Requirement Check" },
      { path: "/undergraduate/courses", kr: "교과목 소개", en: "Courses" },
      { path: "/undergraduate/curriculum-map", kr: "교과목 체계도", en: "Curriculum Map" },
    ],
  },
  {
    path: "/graduate",
    kr: "대학원",
    en: "Graduate",
    children: [
      { path: "/graduate", kr: "대학원 소개", en: "Overview" },
      { path: "/graduate/graduation", kr: "졸업 요건", en: "Graduation Requirements" },
      { path: "/graduate/courses", kr: "교과목 소개", en: "Courses" },
      { path: "/graduate/curriculum-map", kr: "교육·연구 체계도", en: "Academic & Research Map" },
    ],
  },
  {
    path: "/labs",
    kr: "연구실",
    en: "Research Labs",
    children: [
      { path: "/labs/fields", kr: "연구분야 소개", en: "Research Fields" },
      { path: "/labs", kr: "연구실", en: "Research Labs" },
      { path: "/labs/media", kr: "연구실 소개 자료 및 영상", en: "Lab Media" },
    ],
  },
  {
    path: "/news",
    kr: "뉴스 및 공지사항",
    en: "News & Community",
    children: [
      { path: "/news", kr: "공지사항", en: "Notices" },
      { path: "/news/research", kr: "뉴스", en: "News" },
      { path: "/news/thesis-review", kr: "학위논문심사", en: "Thesis Review" },
      { path: "/news/resources", kr: "자료실", en: "Resources" },
      { path: "/news/events", kr: "행사", en: "Events" },
      { path: "/news/seminars", kr: "세미나", en: "Seminars" },
      { path: "/news/calendar", kr: "일정", en: "Calendar" },
    ],
  },
  {
    path: "/admissions",
    kr: "입학·진로",
    en: "Admissions",
    children: [
      { path: "/admissions", kr: "신입학·편입학 안내", en: "Admission Guide" },
      { path: "/admissions/career", kr: "졸업 후 진로·취업현황", en: "Career Outcomes" },
      { path: "/admissions/jobs", kr: "채용정보·인턴십", en: "Jobs & Internships" },
    ],
  },
  { path: "/alumni", kr: "동문·협력", en: "Alumni" },
];

export const ABOUT_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/about")!.children!;
export const FACULTY_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/faculty")!.children!;
export const UNDERGRADUATE_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/undergraduate")!.children!;
export const GRADUATE_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/graduate")!.children!;
export const LABS_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/labs")!.children!;
export const NEWS_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/news")!.children!;
export const ADMISSIONS_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/admissions")!.children!;

/** Prefixes a bare path ("/about") with the locale root ("" for ko, "/en" for en). */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "ko") return path === "/" ? "/" : path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Given the current pathname, returns the equivalent path in the other language. */
export function switchLangPath(pathname: string, targetLang: Lang): string {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const bare = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname || "/";
  return localizePath(bare, targetLang);
}
