import localFont from "next/font/local";

// Yonsei University official brand typefaces.
// Source: reference/YonseiBold.TTF, reference/YonseiLight.TTF
// NOTE: 학교 공식 자산 - 학과 사무실의 실제 사용 승인 확인 필요 (school-issued asset, confirm usage approval with the department office before public launch).
export const yonseiBold = localFont({
  src: "../app/fonts/YonseiBold.ttf",
  variable: "--font-yonsei-bold",
  display: "swap",
  weight: "700",
});

export const yonseiLight = localFont({
  src: "../app/fonts/YonseiLight.ttf",
  variable: "--font-yonsei-light",
  display: "swap",
  weight: "300",
});

// Pretendard variable font - general-purpose UI sans-serif (Tailwind's default font-sans).
export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.ttf",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

// Wanted Sans variable font - used specifically for the header's fixed
// "연세대학교 기계공학부" wordmark text, not the site-wide body/display font.
export const wantedSans = localFont({
  src: "../public/fonts/WantedSansVariable.ttf",
  variable: "--font-wanted-sans",
  display: "swap",
  weight: "100 900",
});

// MaruBuri (마루 부리) - Naver's free serif typeface. Display/heading font for
// the 2026-07 editorial redesign: serif headings + Pretendard body.
// Source: https://hangeul.naver.com (무료 배포, 라이선스 고지 불필요)
export const maruBuri = localFont({
  src: [
    { path: "../public/fonts/MaruBuri-Regular.woff2", weight: "400" },
    { path: "../public/fonts/MaruBuri-SemiBold.woff2", weight: "600" },
    { path: "../public/fonts/MaruBuri-Bold.woff2", weight: "700" },
  ],
  variable: "--font-maruburi",
  display: "swap",
});

export const fontVariables = `${yonseiBold.variable} ${yonseiLight.variable} ${pretendard.variable} ${wantedSans.variable} ${maruBuri.variable}`;
