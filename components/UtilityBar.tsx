"use client";

import type { Lang } from "@/lib/nav";
import { useScrolled } from "@/lib/useScrolled";

const LINKS = [
  { labelKr: "연세대학교", labelEn: "Yonsei University", href: "https://www.yonsei.ac.kr/sc/index.do" },
  { labelKr: "연세포탈", labelEn: "Yonsei Portal", href: "https://portal.yonsei.ac.kr/ui/index.html" },
  { labelKr: "Learnus", labelEn: "Learnus", href: "https://ys.learnus.org/" },
  { labelKr: "연세대학교 공간대관 시스템", labelEn: "Space Reservation System", href: "https://space.yonsei.ac.kr/" },
];

export default function UtilityBar({ lang }: { lang: Lang }) {
  const scrolled = useScrolled();

  return (
    <div
      aria-hidden={scrolled}
      style={{ height: scrolled ? "0px" : "var(--utility-bar-h)" }}
      className={`fixed inset-x-0 top-0 z-[1001] overflow-hidden bg-gradient-to-b from-black/45 to-transparent transition-[height,opacity] duration-300 ${
        scrolled ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="flex h-full items-center overflow-x-auto overflow-y-hidden"
        style={{ paddingInline: "clamp(1.25rem, 4vw, 3rem)" }}
      >
        <ul
          className="flex shrink-0 items-center gap-3 whitespace-nowrap text-[11px] text-white sm:gap-4 sm:text-xs"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {LINKS.map((link, i) => (
            <li key={link.href} className="flex shrink-0 items-center gap-3 sm:gap-4">
              {i > 0 && (
                <span aria-hidden="true" className="text-white/60">
                  |
                </span>
              )}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={scrolled ? -1 : 0}
                className="transition-colors hover:text-white/80"
              >
                {lang === "ko" ? link.labelKr : link.labelEn}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
