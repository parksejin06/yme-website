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

export const fontVariables = `${yonseiBold.variable} ${yonseiLight.variable} ${pretendard.variable}`;
