import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import StaffDirectory from "@/components/about/StaffDirectory";
import { ABOUT_NAV } from "@/lib/nav";
import staffKo from "@/data/staff.json";

export const metadata: Metadata = { title: "Staff" };

const TEAM_EN: Record<string, string> = {
  "대학원": "Graduate Office",
  "학부 행정": "Undergraduate Administration",
  "BK21 교육연구단": "BK21 Education & Research Group",
};

export default function StaffPageEn() {
  const staff = staffKo.map((s) => ({ ...s, team: TEAM_EN[s.team] ?? s.team }));

  return (
    <>
      <PageHero eyebrow="ABOUT US" title="Staff" description="Find administrative contacts for undergraduate, graduate, and research affairs by team." image="/images/new_mainbg/학부소개_배경사진2.jpg" imageAlt="Night view of Yonsei University's Baekyang-ro walkway" />
      <SectionSubNav items={ABOUT_NAV} lang="en" label="About sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "About", path: "/about" }, { label: "Staff" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <StaffDirectory staff={staff} lang="en" />

        <Link href="/en/about/directions" className="mt-10 inline-block text-sm font-medium text-primary hover:underline">
          View Directions →
        </Link>
      </section>
    </>
  );
}
