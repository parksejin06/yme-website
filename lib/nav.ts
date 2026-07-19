export type Lang = "ko" | "en";

export interface NavItem {
  path: string; // path segment under the locale root, e.g. "/about"
  kr: string;
  en: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/about", kr: "학부소개", en: "About" },
  { path: "/faculty", kr: "교수진", en: "Faculty" },
  { path: "/academics", kr: "교육과정", en: "Academics" },
  { path: "/labs", kr: "연구실", en: "Research Labs" },
  { path: "/news", kr: "공지사항", en: "News" },
  { path: "/admissions", kr: "입학·진로", en: "Admissions" },
  { path: "/alumni", kr: "동문·협력", en: "Alumni" },
  { path: "/contact", kr: "오시는 길", en: "Contact" },
];

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
