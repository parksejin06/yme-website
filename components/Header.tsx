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
        <Link href={home} className="flex min-w-0 shrink-0 items-center">
          {/* 연세대학교 공식 시그니처(심볼+국영문 로고타입 통합 이미지) - 학과 사무실 사용 승인 확인 필요.
              원본 423x65 캔버스 중 실제 로고 내용은 x:107~315px 구간뿐이고 나머지 절반은 투명 여백이라,
              그대로 표시하면 로고와 구분선 사이가 크게 벌어져 보인다. object-fit:cover + object-position으로
              투명 여백을 잘라내고 실제 내용만 보여준다 (모바일은 엠블럼만, md 이상은 엠블럼+문구 전체).
              스크롤 전(히어로 위, 어두운 배경)에는 이미지 안 텍스트가 흰색인 버전을, 스크롤 후(흰 배경)에는
              원본(남색/회색 텍스트) 버전을 써서 어느 배경에서도 텍스트가 묻히지 않게 한다. */}
          <Image
            src={light ? "/images/img-sig2-white-text.png" : "/images/img-sig2.png"}
            alt={lang === "ko" ? "연세대학교" : "Yonsei University"}
            width={423}
            height={65}
            priority
            className="h-7 w-7 shrink-0 object-cover mr-1 md:hidden"
            style={{ objectPosition: "30% 50%" }}
          />
          <Image
            src={light ? "/images/img-sig2-white-text.png" : "/images/img-sig2.png"}
            alt={lang === "ko" ? "연세대학교" : "Yonsei University"}
            width={423}
            height={65}
            className="hidden h-9 shrink-0 object-cover md:mr-1.5 md:block"
            style={{ width: "7.5rem", objectPosition: "50% 50%" }}
          />
          <span
            aria-hidden="true"
            className={`self-stretch w-px shrink-0 mr-2 md:mr-3 transition-colors duration-300 ${
              light ? "bg-white/40" : "bg-primary/20"
            }`}
          />
          <span
            className={`min-w-0 max-w-24 shrink break-keep leading-tight transition-colors duration-300 md:max-w-none ${
              light ? "text-white" : "text-primary"
            }`}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "clamp(0.8125rem, 0.6rem + 0.85vw, 1.3125rem)",
            }}
          >
            {lang === "ko" ? "기계공학부" : "Mechanical Engineering"}
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
