import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import FacultyGrid from "@/components/FacultyGrid";
import { FACULTY_NAV } from "@/lib/nav";
import { getFaculty } from "@/lib/faculty-data";

export const metadata: Metadata = { title: "Full-time Faculty" };
export const dynamic = "force-dynamic";

export default async function FacultyPageEn() {
  const faculty = await getFaculty();
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="Full-time Faculty"
        description={`Introducing ${faculty.length} faculty members across 6 research fields: Mechanics & Materials, Energy & Thermofluids, Robotics & Control, Design & Manufacturing, Micro & Nano, and Bio & Photonics. Click a card for contact details and lab information.`}
      />
      <SectionSubNav items={FACULTY_NAV} lang="en" label="Faculty sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Faculty" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <FacultyGrid lang="en" members={faculty} />
      </section>
    </>
  );
}
