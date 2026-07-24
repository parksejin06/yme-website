import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s | 관리자 - 연세대학교 기계공학부",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-surface-muted antialiased">{children}</body>
    </html>
  );
}
