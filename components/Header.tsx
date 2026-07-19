"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import LanguageToggle from "@/components/LanguageToggle";
import { localizePath, type Lang } from "@/lib/nav";

export default function Header({ lang }: { lang: Lang }) {
  const home = localizePath("/", lang);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-white/95 backdrop-blur"
          : "border-b border-transparent bg-gradient-to-b from-black/45 via-black/10 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={home} className="flex items-center gap-2.5 shrink-0">
          {/* 연세대학교 공식 심볼 - 학과 사무실 사용 승인 확인 필요 */}
          <Image
            src="/images/new_transparent_logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
          />
          <span
            className={`font-display text-[15px] leading-tight transition-colors duration-300 sm:text-lg ${
              light ? "text-white" : "text-primary"
            }`}
          >
            {lang === "ko" ? (
              <>
                연세대학교
                <br className="sm:hidden" /> 기계공학부
              </>
            ) : (
              <>
                Yonsei University
                <br className="sm:hidden" /> School of Mechanical Engineering
              </>
            )}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <DesktopNav lang={lang} light={light} />
          <LanguageToggle lang={lang} light={light} />
          <MobileNav lang={lang} light={light} />
        </div>
      </div>
    </header>
  );
}
