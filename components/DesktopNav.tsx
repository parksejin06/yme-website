"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";

export default function DesktopNav({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPath(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPath(null), 150);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <nav aria-label={lang === "ko" ? "주 내비게이션" : "Main navigation"} className="hidden xl:block">
      <ul className="flex items-center gap-4 whitespace-nowrap">
        {NAV_ITEMS.map((item) => {
          const href = localizePath(item.path, lang);
          const active = pathname === href || (item.children && item.children.some((c) => pathname === localizePath(c.path, lang)));
          const activeClass = light ? "text-white after:w-full after:bg-white" : "text-primary after:w-full after:bg-primary";
          const inactiveClass = light
            ? "text-white/85 after:w-0 after:bg-white hover:text-white hover:after:w-full"
            : "text-ink/75 after:w-0 after:bg-primary hover:text-primary hover:after:w-full";
          const linkClass = `relative shrink-0 py-1 text-[13px] font-body font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all ${
            active ? activeClass : inactiveClass
          }`;

          if (!item.children) {
            return (
              <li key={item.path}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpenPath(null)}
                  className={linkClass}
                >
                  {lang === "ko" ? item.kr : item.en}
                </Link>
              </li>
            );
          }

          const isOpen = openPath === item.path;
          const twoColumn = item.children.length > 5;

          return (
            <li key={item.path} className="relative" onMouseEnter={() => { cancelClose(); setOpenPath(item.path); }} onMouseLeave={scheduleClose}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => setOpenPath(isOpen ? null : item.path)}
                className={linkClass}
              >
                {lang === "ko" ? item.kr : item.en}
              </button>

              {isOpen && (
                <div
                  className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 ${twoColumn ? "w-80" : "w-56"}`}
                  onFocus={cancelClose}
                >
                  <div className="overflow-hidden rounded-lg border border-line bg-white shadow-lg">
                    <p className="border-b border-line bg-surface-muted px-4 py-2.5 text-xs font-display tracking-wide text-ink/50">
                      {lang === "ko" ? item.kr : item.en}
                    </p>
                    <ul className={`py-1.5 ${twoColumn ? "grid grid-cols-2" : ""}`}>
                      {item.children.map((sub) => {
                        const subHref = localizePath(sub.path, lang);
                        const subActive = pathname === subHref;
                        return (
                          <li key={sub.path}>
                            <Link
                              href={subHref}
                              onClick={() => setOpenPath(null)}
                              className={`block px-4 py-2.5 text-sm transition-colors ${
                                subActive ? "bg-primary/5 font-medium text-primary" : "text-ink/75 hover:bg-surface-muted hover:text-primary"
                              }`}
                            >
                              {lang === "ko" ? sub.kr : sub.en}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
