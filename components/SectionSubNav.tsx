"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizePath, type Lang, type NavSubItem } from "@/lib/nav";

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

  return (
    <div className="sticky top-20 z-30 border-b border-line bg-white/95 backdrop-blur sm:top-24">
      <nav aria-label={label} className="mx-auto max-w-wide px-[var(--page-gutter)]">
        <ul className="flex justify-center gap-1 overflow-x-auto sm:gap-2">
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
