"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLangPath, type Lang } from "@/lib/nav";

export default function LanguageToggle({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const pathname = usePathname();
  const koHref = switchLangPath(pathname, "ko");
  const enHref = switchLangPath(pathname, "en");

  const activeClass = light ? "font-semibold text-white" : "font-semibold text-primary";
  const inactiveClass = light ? "text-white/60 hover:text-white/85" : "text-ink/55 hover:text-ink/80";
  const dividerClass = light ? "text-white/35" : "text-ink/25";

  return (
    <div
      role="group"
      aria-label="Language / 언어 선택"
      className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] transition-colors duration-300"
    >
      <Link href={koHref} aria-current={lang === "ko" ? "page" : undefined} className={lang === "ko" ? activeClass : inactiveClass}>
        KOR
      </Link>
      <span className={dividerClass} aria-hidden="true">
        |
      </span>
      <Link href={enHref} aria-current={lang === "en" ? "page" : undefined} className={lang === "en" ? activeClass : inactiveClass}>
        ENG
      </Link>
    </div>
  );
}
