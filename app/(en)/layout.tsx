import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import UtilityBar from "@/components/UtilityBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yonsei University School of Mechanical Engineering",
    template: "%s | Yonsei University School of Mechanical Engineering",
  },
  description:
    "Relentless challenge, creating value for the world - Yonsei University School of Mechanical Engineering.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <UtilityBar lang="en" />
        <Header lang="en" />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang="en" />
      </body>
    </html>
  );
}
