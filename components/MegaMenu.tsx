"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";
import { useScrolled } from "@/lib/useScrolled";

export default function MegaMenu({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: Lang }) {
  const pathname = usePathname();
  const scrolled = useScrolled();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      id="mega-menu-panel"
      role="region"
      aria-hidden={!open}
      aria-label={lang === "ko" ? "전체 메뉴" : "Full site menu"}
      style={{
        top: scrolled ? "6rem" : "calc(var(--utility-bar-h) + 6rem)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`fixed inset-x-0 z-40 border-t border-white/10 bg-black/85 shadow-2xl backdrop-blur-sm transition-all ${
        open ? "opacity-100 translate-y-0 duration-[520ms]" : "pointer-events-none opacity-0 -translate-y-4 duration-[320ms]"
      }`}
    >
      <div
        className="grid grid-cols-8 gap-x-5 pb-8 pt-10"
        style={{ paddingInline: "clamp(2rem, 4vw, 6rem)" }}
      >
        {NAV_ITEMS.map((item) => {
          const topHref = localizePath(item.path, lang);
          return (
            <div key={item.path}>
              <Link
                href={topHref}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="inline-block text-[15px] font-display font-semibold leading-tight text-white transition-colors hover:text-white/80"
              >
                {lang === "ko" ? item.kr : item.en}
              </Link>
              {item.children && item.children.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {item.children.map((sub) => {
                    const subHref = localizePath(sub.path, lang);
                    const subActive = pathname === subHref;
                    return (
                      <li key={sub.path}>
                        <Link
                          href={subHref}
                          onClick={onClose}
                          tabIndex={open ? 0 : -1}
                          className={`block text-[13px] leading-snug transition-colors ${
                            subActive ? "text-white" : "text-white/60 hover:text-white"
                          }`}
                        >
                          {lang === "ko" ? sub.kr : sub.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {/* Soft fade into the page below instead of a hard-edged cutoff line. */}
      <div className="h-14 bg-gradient-to-b from-black/85 to-transparent" aria-hidden="true" />
    </div>
  );
}
