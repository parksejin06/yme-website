"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Subtle scroll parallax wrapper for decorative imagery (2026-07 tone rework).
 * The child drifts vertically a few px as the section moves through the
 * viewport, and is slightly over-scaled so the drift never exposes gaps at
 * the container edges. Motion is skipped entirely under
 * prefers-reduced-motion; the image then renders statically.
 */
export default function ParallaxImage({
  children,
  className = "",
  strength = 22,
  scale = 1.08,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  scale?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    inner.style.willChange = "transform";
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 (below viewport) .. 0 (centered) .. 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      inner.style.transform = `translateY(${(-clamped * strength).toFixed(1)}px) scale(${scale})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, scale]);

  // Feathered edges: the container itself is masked so the photo fades to
  // fully transparent well before its bounding box — no visible frame line,
  // just the image dissolving into the page background. The mask sits on the
  // (static) outer box, so the parallax drift happens "behind" soft edges.
  const edgeMask = {
    maskImage:
      "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  } as React.CSSProperties;

  return (
    <div ref={outerRef} className={`relative overflow-hidden ${className}`} style={edgeMask}>
      <div ref={innerRef} className="h-full w-full" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
