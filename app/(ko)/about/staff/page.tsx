import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import StaffDirectory from "@/components/about/StaffDirectory";
import { ABOUT_NAV } from "@/lib/nav";
import staff from "@/data/staff.json";

export const metadata: Metadata = { title: "교직원" };

export default function StaffPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="교직원" description="학부·대학원·연구행정 담당자를 업무별로 빠르게 확인할 수 있습니다." image="/images/new_mainbg/학부소개_배경사진2.jpg" imageAlt="연세대학교 백양로 야경" />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부소개", path: "/about" }, { label: "교직원" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <StaffDirectory staff={staff} lang="ko" />

        <Link
          href="/about/directions"
          className="mt-10 inline-block text-sm font-medium text-primary hover:underline"
        >
          오시는 길 보기 →
        </Link>
      </section>
    </>
  );
}
