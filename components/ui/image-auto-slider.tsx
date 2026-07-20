import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { localizePath, type Lang } from "@/lib/nav";

interface GalleryItem {
  image: string;
  alt: { kr: string; en: string };
  title: { kr: string; en: string };
  subtitle: { kr: string; en: string };
  href: string;
  external?: boolean;
}

const items: GalleryItem[] = [
  {
    image: "/images/robotics-lab.jpg",
    alt: { kr: "로봇공학 실습실", en: "Robotics lab" },
    title: { kr: "교수진 소개", en: "Faculty" },
    subtitle: { kr: "6개 연구분야의 교수진을 만나보세요", en: "Meet our faculty across 6 research fields" },
    href: "/faculty",
  },
  {
    image: "/images/engine-exploded.jpg",
    alt: { kr: "엔진 구조 분해도", en: "Exploded view of an engine" },
    title: { kr: "연구실·연구분야", en: "Research Labs" },
    subtitle: { kr: "26개 연구실의 연구 성과를 소개합니다", en: "Explore the work of 26 research laboratories" },
    href: "/labs",
  },
  {
    image: "/images/hero-campus.jpg",
    alt: { kr: "연세대학교 기계공학부 건물 전경", en: "Yonsei University School of Mechanical Engineering building" },
    title: { kr: "학부", en: "Undergraduate" },
    subtitle: { kr: "졸업요건부터 교과목 체계도까지", en: "From graduation requirements to the curriculum map" },
    href: "/undergraduate",
  },
  {
    image: "/images/campus-courtyard.jpg",
    alt: { kr: "연세대학교 캠퍼스 안뜰", en: "A courtyard on Yonsei University's campus" },
    title: { kr: "대학원", en: "Graduate" },
    subtitle: { kr: "석사·박사·석박사통합 과정 안내", en: "Master's, doctoral, and combined-program information" },
    href: "/graduate",
  },
  {
    image: "/images/eagle-statue.jpg",
    alt: { kr: "연세대학교 독수리상", en: "Yonsei University's eagle statue" },
    title: { kr: "입학·진학·취업", en: "Admissions & Careers" },
    subtitle: { kr: "입학부터 진로까지", en: "From admission to career paths" },
    href: "/admissions",
  },
  {
    image: "/images/underwood-hall.jpg",
    alt: { kr: "담쟁이로 덮인 연세대학교 본관", en: "Underwood Hall, Yonsei University's ivy-covered main building" },
    title: { kr: "오시는 길", en: "Contact & Directions" },
    subtitle: {
      kr: "연세대학교 기계공학부 찾아오시는 길",
      en: "Find your way to the School of Mechanical Engineering",
    },
    href: "/contact",
  },
  {
    image: "/images/campus-aerial.jpg",
    alt: { kr: "연세대학교 신촌캠퍼스 항공뷰", en: "Aerial view of Yonsei University's Sinchon campus" },
    title: { kr: "연세대학교 공식 홈페이지", en: "Yonsei University Official Website" },
    subtitle: { kr: "Yonsei University 바로가기", en: "Visit the Yonsei University homepage" },
    href: "https://www.yonsei.ac.kr",
    external: true,
  },
];

// Duplicated for a seamless looping strip
const duplicatedItems = [...items, ...items];

function GalleryCard({ item, lang }: { item: GalleryItem; lang: Lang }) {
  return (
    <div className="group relative h-72 w-56 shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-2xl sm:h-80 sm:w-72">
      <Image
        src={item.image}
        alt={lang === "ko" ? item.alt.kr : item.alt.en}
        fill
        sizes="(min-width: 640px) 288px, 224px"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-colors duration-300 group-hover:from-black/95" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-base font-bold text-white sm:text-lg">
            {lang === "ko" ? item.title.kr : item.title.en}
          </h3>
          {item.external && <ExternalLink className="h-4 w-4 shrink-0 text-white/90" aria-hidden="true" />}
        </div>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">{lang === "ko" ? item.subtitle.kr : item.subtitle.en}</p>
      </div>
    </div>
  );
}

export function ImageAutoSlider({ lang }: { lang: Lang }) {
  return (
    <div className="relative w-full overflow-hidden bg-white py-10">
      <div className="relative flex w-full items-center justify-center">
        <div className="auto-slider-mask w-full max-w-6xl">
          <div className="auto-slider-track flex w-max gap-6">
            {duplicatedItems.map((item, index) => {
              const title = lang === "ko" ? item.title.kr : item.title.en;
              const key = `${item.href}-${index}`;

              if (item.external) {
                return (
                  <a
                    key={key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} (${lang === "ko" ? "새 탭에서 열림" : "opens in a new tab"})`}
                  >
                    <GalleryCard item={item} lang={lang} />
                  </a>
                );
              }

              return (
                <Link key={key} href={localizePath(item.href, lang)}>
                  <GalleryCard item={item} lang={lang} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
