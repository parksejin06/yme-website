"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLangPath, type Lang } from "@/lib/nav";

export default function LanguageToggle({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const pathname = usePathname();
  const koHref = switchLangPath(pathname, "ko");
  const enHref = switchLangPath(pathname, "en");

  const activeClass = light ? "bg-white text-primary" : "bg-primary text-white";
  const inactiveClass = light ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink";

  return (
    <div
      role="group"
      aria-label="Language / 언어 선택"
      className={`flex shrink-0 items-center whitespace-nowrap rounded-full border p-0.5 text-xs font-body font-medium transition-colors duration-300 ${
        light ? "border-white/50" : "border-line"
      }`}
    >
      <Link
        href={koHref}
        aria-current={lang === "ko" ? "page" : undefined}
        className={`rounded-full px-2 py-1 transition-colors sm:px-3 ${lang === "ko" ? activeClass : inactiveClass}`}
      >
        한국어
      </Link>
      <Link
        href={enHref}
        aria-current={lang === "en" ? "page" : undefined}
        className={`rounded-full px-2 py-1 transition-colors sm:px-3 ${lang === "en" ? activeClass : inactiveClass}`}
      >
        EN
      </Link>
    </div>
  );
}
