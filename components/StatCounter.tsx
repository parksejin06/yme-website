"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  label,
  suffix = "",
  duration = 1700,
}: {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  // Ledger-row styling for the inverted navy stats band: small tracked label
  // on top, large serif figure below, no icons.
  return (
    <div ref={ref}>
      <p className="font-body text-[11px] font-medium tracking-[0.22em] text-white/55 sm:text-xs">{label}</p>
      <p
        className="mt-2.5 font-display text-4xl text-white sm:text-5xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {display}
        <span className="ml-1 text-[0.45em] text-white/70">{suffix}</span>
      </p>
    </div>
  );
}
