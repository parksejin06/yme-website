import Link from "next/link";
import { ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";
import { localizePath, type Lang } from "@/lib/nav";

export interface BreadcrumbItem {
  label: string;
  path?: string; // omit for the current page (non-link)
}

export default function Breadcrumb({ items, lang }: { items: BreadcrumbItem[]; lang: Lang }) {
  const home = { label: lang === "ko" ? "홈" : "Home", path: "/" };
  const trail = [home, ...items];
  const parent = items.length >= 2 ? items[items.length - 2] : home;

  return (
    <div className="border-b border-line bg-surface-muted/60">
      <div className="mx-auto max-w-content px-4 py-2.5 sm:px-6">
        {/* Desktop: full breadcrumb trail */}
        <ol className="hidden items-center gap-1.5 text-xs text-ink/50 sm:flex">
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRightIcon className="h-3 w-3 text-ink/30" />}
                {item.path && !isLast ? (
                  <Link href={localizePath(item.path, lang)} className="hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-ink/70" : undefined}>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>

        {/* Mobile: compact back link to parent */}
        <Link
          href={localizePath(parent.path ?? "/", lang)}
          className="flex min-h-8 items-center gap-1 text-xs text-ink/60 sm:hidden"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          {parent.label}
        </Link>
      </div>
    </div>
  );
}
