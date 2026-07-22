import Image from "next/image";
import Link from "next/link";
import contact from "@/data/contact.json";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";

// Inverted navy footer (2026-07 redesign): the deep brand block that closes
// every page, replacing the light gray utility footer.
export default function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-strong text-white">
      <div className="mx-auto grid max-w-content gap-12 px-[var(--page-gutter)] py-16 md:grid-cols-[auto_1fr_auto] md:gap-16">
        <div className="flex items-start gap-4">
          {/* 연세대학교 공식 심볼 - 학과 사무실 사용 승인 확인 필요 */}
          <Image
            src="/images/new_transparent_logo.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <div>
            <p className="font-display text-lg leading-snug text-white">
              {lang === "ko" ? (
                <>
                  연세대학교
                  <br />
                  기계공학부
                </>
              ) : (
                <>
                  Yonsei University
                  <br />
                  School of Mechanical Engineering
                </>
              )}
            </p>
            <p className="mt-2 font-body text-[11px] tracking-[0.25em] text-white/40">SINCE 1962</p>
          </div>
        </div>

        <div className="text-sm leading-relaxed text-white/65 md:border-l md:border-white/15 md:pl-16">
          <p>
            {lang === "ko" ? contact.address.kr : contact.address.en} ({contact.address.postal})
          </p>
          <p className="mt-2">
            <span className="mr-2 text-white/40">TEL</span>
            {contact.phone}
          </p>
          <p className="mt-1">
            <span className="mr-2 text-white/40">EMAIL</span>
            {contact.email}
          </p>
        </div>

        <nav aria-label={lang === "ko" ? "바로가기" : "Quick links"}>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm text-white/65">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link href={localizePath(item.path, lang)} className="transition-colors hover:text-white">
                  {lang === "ko" ? item.kr : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/12 px-[var(--page-gutter)] py-5 text-center text-xs text-white/40">
        © {year} Yonsei University School of Mechanical Engineering. All rights reserved.
      </div>
    </footer>
  );
}
