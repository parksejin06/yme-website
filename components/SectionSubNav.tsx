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
    <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur">
      <nav aria-label={label} className="mx-auto max-w-content px-4 sm:px-6">
        <ul className="flex gap-1 overflow-x-auto">
          {items.map((item) => {
            const href = localizePath(item.path, lang);
            const active = pathname === href;
            return (
              <li key={item.path} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center border-b-2 px-3.5 text-sm font-medium transition-colors sm:text-[13px] ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-ink/60 hover:border-line hover:text-ink"
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
