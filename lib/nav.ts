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
  { path: "/about", kr: "학부소개", en: "About" },
  {
    path: "/undergraduate",
    kr: "학부",
    en: "Undergraduate",
    children: [
      { path: "/undergraduate", kr: "학부 개요", en: "Overview" },
      { path: "/undergraduate/goals", kr: "교육 목표", en: "Education Goals" },
      { path: "/undergraduate/graduation", kr: "졸업 요건", en: "Graduation Requirements" },
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
  { path: "/faculty", kr: "교수진", en: "Faculty" },
  { path: "/labs", kr: "연구실", en: "Research Labs" },
  { path: "/news", kr: "공지사항", en: "News" },
  { path: "/admissions", kr: "입학·진로", en: "Admissions" },
  { path: "/alumni", kr: "동문·협력", en: "Alumni" },
  { path: "/contact", kr: "오시는 길", en: "Contact" },
];

export const UNDERGRADUATE_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/undergraduate")!.children!;
export const GRADUATE_NAV: NavSubItem[] = NAV_ITEMS.find((i) => i.path === "/graduate")!.children!;

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
