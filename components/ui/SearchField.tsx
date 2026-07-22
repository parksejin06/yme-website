"use client";

import { Search, X } from "lucide-react";

/** Rectangular search field (56-64px tall, radius-md) -- replaces the ad hoc rounded-full search inputs. */
export default function SearchField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  name,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
  name?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink/35" aria-hidden="true" />
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="h-14 w-full rounded-md border border-line bg-white pl-11 pr-10 text-[15px] text-ink outline-none placeholder:text-ink/40 focus:border-primary sm:h-16 sm:text-base"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="clear"
          className="absolute right-0 top-1/2 flex h-14 w-11 -translate-y-1/2 items-center justify-center text-ink/35 hover:text-ink/60 sm:h-16"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
