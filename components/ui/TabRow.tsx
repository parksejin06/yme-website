"use client";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

/**
 * Flat underline tab list for category/type/year filters -- the shared
 * replacement for the rounded-full chip buttons that used to be copy-pasted
 * per component. Selection state reads from color + weight + a bottom
 * indicator line, never from a filled pill shape.
 */
export default function TabRow({
  items,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  size?: "md" | "sm";
}) {
  const sizing =
    size === "sm"
      ? "min-h-[44px] px-3.5 text-sm sm:min-h-[50px] sm:px-4 sm:text-[15px]"
      : "min-h-[52px] px-4 text-[15px] sm:min-h-[58px] sm:px-5 sm:text-base";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-x-5 overflow-x-auto border-b border-line sm:flex-wrap sm:gap-x-7"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-[3px] font-display transition-colors ${sizing} ${
              active ? "border-primary font-bold text-primary" : "border-transparent text-ink/55 hover:text-ink"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="font-body text-xs font-normal opacity-60">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
