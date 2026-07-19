import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "연세대학교 기계공학부",
    template: "%s | 연세대학교 기계공학부",
  },
  description:
    "멈추지 않는 도전으로 세상에 유익한 가치를 만듭니다 - 연세대학교 기계공학부 공식 홈페이지.",
};

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a href="#main" className="skip-link">
          본문 바로가기
        </a>
        <Header lang="ko" />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang="ko" />
      </body>
    </html>
  );
}
