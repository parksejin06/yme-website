import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EmeritusFacultyGrid from "@/components/EmeritusFacultyGrid";
import { FACULTY_NAV } from "@/lib/nav";
import { getFacultyEmeritus } from "@/lib/faculty-data";

export const metadata: Metadata = { title: "Emeritus & Retired Faculty" };
export const dynamic = "force-dynamic";

export default async function EmeritusFacultyPageEn() {
  const emeritus = await getFacultyEmeritus();
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="Emeritus & Retired Faculty"
        description={`Honoring ${emeritus.length} emeritus and retired faculty who contributed to Yonsei Mechanical Engineering.`}
      />
      <SectionSubNav items={FACULTY_NAV} lang="en" label="Faculty sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Faculty", path: "/faculty" }, { label: "Emeritus & Retired Faculty" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <EmeritusFacultyGrid faculty={emeritus} lang="en" />
      </section>
    </>
  );
}
