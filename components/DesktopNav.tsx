"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";

export default function DesktopNav({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label={lang === "ko" ? "주 내비게이션" : "Main navigation"} className="hidden md:block">
      <ul className="flex items-center gap-7">
        {NAV_ITEMS.map((item) => {
          const href = localizePath(item.path, lang);
          const active = pathname === href;
          const activeClass = light ? "text-white after:w-full after:bg-white" : "text-primary after:w-full after:bg-primary";
          const inactiveClass = light
            ? "text-white/85 after:w-0 after:bg-white hover:text-white hover:after:w-full"
            : "text-ink/75 after:w-0 after:bg-primary hover:text-primary hover:after:w-full";
          return (
            <li key={item.path}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm font-body font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all ${
                  active ? activeClass : inactiveClass
                }`}
              >
                {lang === "ko" ? item.kr : item.en}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
