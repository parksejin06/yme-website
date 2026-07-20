"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Collapse from "@/components/ui/Collapse";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";

export default function MobileNav({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? (lang === "ko" ? "메뉴 닫기" : "Close menu") : lang === "ko" ? "메뉴 열기" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-md"
      >
        <span
          className={`block h-0.5 w-6 transition-transform ${open ? "translate-y-2 rotate-45 bg-ink" : light ? "bg-white" : "bg-ink"}`}
        />
        <span
          className={`block h-0.5 w-6 transition-opacity ${open ? "opacity-0" : light ? "bg-white" : "bg-ink"}`}
        />
        <span
          className={`block h-0.5 w-6 transition-transform ${open ? "-translate-y-2 -rotate-45 bg-ink" : light ? "bg-white" : "bg-ink"}`}
        />
      </button>

      {open && (
        <div id="mobile-nav-panel" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white">
          <nav aria-label={lang === "ko" ? "모바일 내비게이션" : "Mobile navigation"}>
            <ul className="flex flex-col divide-y divide-line px-6">
              {NAV_ITEMS.map((item) => {
                if (!item.children) {
                  return (
                    <li key={item.path}>
                      <Link
                        href={localizePath(item.path, lang)}
                        onClick={() => setOpen(false)}
                        className="flex min-h-14 items-center py-4 font-body font-medium text-lg text-ink"
                      >
                        {lang === "ko" ? item.kr : item.en}
                      </Link>
                    </li>
                  );
                }

                const isExpanded = expanded === item.path;

                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : item.path)}
                      className="flex min-h-14 w-full items-center justify-between py-4 text-left font-body font-medium text-lg text-ink"
                    >
                      {lang === "ko" ? item.kr : item.en}
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-ink/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <Collapse open={isExpanded}>
                      <ul className="pb-2">
                        {item.children.map((sub) => (
                          <li key={sub.path}>
                            <Link
                              href={localizePath(sub.path, lang)}
                              onClick={() => setOpen(false)}
                              className="flex min-h-11 items-center py-2.5 pl-4 text-base text-ink/70"
                            >
                              {lang === "ko" ? sub.kr : sub.en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
