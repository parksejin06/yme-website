"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizePath, type Lang, type NavSubItem } from "@/lib/nav";
import { useScrolled } from "@/lib/useScrolled";

export default function SectionSubNav({
  items,
  lang,
  label,
}: {
  items: NavSubItem[];
  lang: Lang;
  label: string;
}) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const ub = scrolled ? "0px" : "var(--utility-bar-h)";

  return (
    <div
      style={{ "--ub": ub } as React.CSSProperties}
      className="sticky z-30 border-b border-line bg-white/95 backdrop-blur [top:calc(var(--ub)+5rem)] sm:[top:calc(var(--ub)+6rem)]"
    >
      <nav aria-label={label} className="mx-auto max-w-wide px-[var(--page-gutter)]">
        <ul className="flex justify-center gap-1 overflow-x-auto overflow-y-hidden sm:gap-2">
          {items.map((item) => {
            const href = localizePath(item.path, lang);
            const active = pathname === href;
            return (
              <li key={item.path} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[64px] items-center border-b-[3px] px-4 text-base font-semibold transition-colors sm:min-h-[72px] sm:px-7 sm:text-lg ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-ink/55 hover:border-line hover:text-ink"
                  }`}
                >
                  {lang === "ko" ? item.kr : item.en}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
