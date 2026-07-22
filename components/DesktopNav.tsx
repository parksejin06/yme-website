"use client";

import { useEffect, useRef, useState } from "react";
import { type Lang } from "@/lib/nav";
import MegaMenu from "@/components/MegaMenu";

const OPEN_DELAY = 200;
const CLOSE_DELAY = 200;

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[22px] w-[30px] shrink-0" aria-hidden="true">
      <span
        className={`absolute left-0 right-0 h-[2.5px] rounded-full bg-current transition-all duration-300 ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
        }`}
      />
      <span
        className={`absolute left-0 right-0 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 right-0 h-[2.5px] rounded-full bg-current transition-all duration-300 ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
        }`}
      />
    </span>
  );
}

export default function DesktopNav({ lang, light = false }: { lang: Lang; light?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleOpen() {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY);
  }

  function scheduleClose() {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }

  function closeAndRefocus() {
    clearTimers();
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) closeAndRefocus();
    }
    function onPointerDown(e: PointerEvent) {
      if (open && rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  const textClass = light ? "text-white" : "text-ink";

  return (
    <div ref={rootRef} className="hidden xl:block" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        onClick={() => {
          clearTimers();
          setOpen((v) => !v);
        }}
        className={`flex items-center gap-3 transition-colors duration-300 ${textClass}`}
      >
        <span className="text-[15px] font-body font-medium tracking-wide">{lang === "ko" ? "메뉴" : "MENU"}</span>
        <HamburgerIcon open={open} />
      </button>

      <MegaMenu open={open} onClose={closeAndRefocus} lang={lang} />
    </div>
  );
}
