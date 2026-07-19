import Image from "next/image";
import Link from "next/link";
import contact from "@/data/contact.json";
import { NAV_ITEMS, localizePath, type Lang } from "@/lib/nav";

export default function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface-muted">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr_1fr]">
        <div className="flex items-start gap-3">
          {/* 연세대학교 공식 심볼 - 학과 사무실 사용 승인 확인 필요 */}
          <Image
            src="/images/new_transparent_logo.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <p className="font-display text-base text-primary">
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
        </div>

        <div className="text-sm text-ink/70">
          <p>{lang === "ko" ? contact.address.kr : contact.address.en} ({contact.address.postal})</p>
          <p className="mt-1">
            TEL {contact.phone} &nbsp;·&nbsp; EMAIL {contact.email}
          </p>
        </div>

        <nav aria-label={lang === "ko" ? "바로가기" : "Quick links"}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link href={localizePath(item.path, lang)} className="hover:text-primary">
                  {lang === "ko" ? item.kr : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line px-4 py-5 text-center text-xs text-ink/70 sm:px-6">
        © {year} Yonsei University School of Mechanical Engineering. All rights reserved.
      </div>
    </footer>
  );
}
