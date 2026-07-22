"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ScrollSlideIn({
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

    el.classList.add("slide-pending");

    // Keeps observing (never unobserve/disconnect early) and toggles
    // is-visible both ways, so the slide-in replays every time the section
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return (
    <div ref={ref} className={`slide-in-right ${className}`}>
      {children}
    </div>
  );
}
