"use client";

import Image from "next/image";
import Link from "next/link";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import LanguageToggle from "@/components/LanguageToggle";
import { localizePath, type Lang } from "@/lib/nav";
import { useScrolled } from "@/lib/useScrolled";

export default function Header({ lang }: { lang: Lang }) {
  const home = localizePath("/", lang);
  const scrolled = useScrolled();

  const light = !scrolled;

  return (
    <header
      style={{ top: scrolled ? "0px" : "var(--utility-bar-h)" }}
      className={`fixed inset-x-0 z-[1000] h-20 transition-all duration-300 sm:h-24 ${
        scrolled
          ? "border-b border-line bg-white/97 backdrop-blur"
          : "border-b border-transparent bg-gradient-to-b from-black/50 via-black/15 to-transparent"
      }`}
    >
      <div
        className="flex h-full w-full items-center justify-between"
        style={{ paddingInline: "clamp(1.25rem, 4vw, 3rem)" }}
      >
        <Link href={home} className="flex min-w-0 shrink-0 items-center gap-3">
          {/* 연세대학교 공식 심볼 - 학과 사무실 사용 승인 확인 필요 */}
          <Image
            src="/images/new_transparent_logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <span
            className={`min-w-0 break-keep font-display font-semibold leading-tight transition-colors duration-300 ${
              light ? "text-white" : "text-primary"
            }`}
            style={{ fontSize: "clamp(0.875rem, 0.55rem + 1vw, 1.25rem)" }}
          >
            {lang === "ko" ? (
              <>
                연세대학교
                <br className="sm:hidden" /> 기계공학부
              </>
            ) : (
              <>
                Yonsei University
                <br /> Mechanical Engineering
              </>
            )}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-5 sm:gap-8">
          <LanguageToggle lang={lang} light={light} />
          <DesktopNav lang={lang} light={light} />
          <MobileNav lang={lang} light={light} />
        </div>
      </div>
    </header>
  );
}
