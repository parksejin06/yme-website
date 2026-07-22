"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Only hide the element once we know JS + observers are working, so
    // no-JS or slow-JS clients simply see the content already in place.
    el.classList.add("reveal-pending");

    // Keeps observing (never unobserve/disconnect early) and toggles
    // is-visible both ways, so the reveal replays every time the section
    // re-enters the viewport instead of only on its first appearance.
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => el.classList.add("is-visible"), delayMs);
        } else {
          clearTimeout(timeoutId);
          el.classList.remove("is-visible");
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
