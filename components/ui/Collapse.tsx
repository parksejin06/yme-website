"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Animates open/close by measuring content's natural height (more reliable across
 * rendering engines than the grid-template-rows fr-unit trick). */
export default function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    setMaxHeight(open ? el.scrollHeight : 0);
  }, [open]);

  return (
    <div
      style={{ maxHeight }}
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0"}`}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
