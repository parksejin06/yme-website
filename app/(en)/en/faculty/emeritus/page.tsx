import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import EmeritusFacultyGrid from "@/components/EmeritusFacultyGrid";
import { FACULTY_NAV } from "@/lib/nav";
import emeritus from "@/data/faculty-emeritus.json";

export const metadata: Metadata = { title: "Emeritus & Retired Faculty" };

export default function EmeritusFacultyPageEn() {
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="Emeritus & Retired Faculty"
        description={`Honoring ${emeritus.length} emeritus and retired faculty who contributed to Yonsei Mechanical Engineering.`}
      />
      <SectionSubNav items={FACULTY_NAV} lang="en" label="Faculty sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Faculty", path: "/faculty" }, { label: "Emeritus & Retired Faculty" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <EmeritusFacultyGrid faculty={emeritus} lang="en" />
      </section>
    </>
  );
}
