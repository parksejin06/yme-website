"use client";

export interface SelectOption {
  value: string;
  label: string;
}

/** Styled native <select> (52-60px tall, radius-md) for filters with too many options for a tab row. */
export default function SelectField({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <label className={`inline-flex shrink-0 items-center gap-2 text-sm text-ink/70 ${className}`}>
      {label && <span className="shrink-0 font-medium text-ink/70">{label}</span>}
      <select
        aria-label={ariaLabel ?? label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 rounded-md border border-line bg-white px-3 text-[15px] text-ink outline-none focus:border-primary sm:h-16 sm:px-4 sm:text-base"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
