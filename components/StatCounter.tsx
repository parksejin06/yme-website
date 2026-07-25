"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduceMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCE_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReduceMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}
function getReduceMotionServerSnapshot() {
  return false;
}

/** Reads the OS-level "prefers reduced motion" setting reactively (and safely
 * across server rendering, where `window` doesn't exist). Used instead of a
 * useEffect + setState so skipping the count-up animation doesn't itself
 * require a synchronous setState inside an effect body. */
function useReduceMotion(): boolean {
  return useSyncExternalStore(subscribeReduceMotion, getReduceMotionSnapshot, getReduceMotionServerSnapshot);
}

export default function StatCounter({
  value,
  label,
  icon,
  suffix = "",
  duration = 1700,
}: {
  value: number;
  label: string;
  icon: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

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
  }, [value, duration, reduceMotion]);

  const shown = reduceMotion ? value : display;

  // Light stats band styling (ported from main's ac71c14): centered icon over
  // the figure, navy-on-light colors, with the redesign's serif figure and
  // small inline suffix kept.
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <Image
        src={icon}
        alt=""
        width={44}
        height={44}
        aria-hidden="true"
        className="h-9 w-9 object-contain sm:h-11 sm:w-11"
      />
      <p
        className="mt-3 font-display text-4xl text-primary-strong sm:mt-4 sm:text-5xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {shown}
        <span className="ml-1 text-[0.45em] text-primary-strong/70">{suffix}</span>
      </p>
      <p className="mt-1.5 text-xs tracking-wide text-ink/70 sm:text-sm">{label}</p>
    </div>
  );
}
