import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FacultyGrid from "@/components/FacultyGrid";
import faculty from "@/data/faculty.json";

export const metadata: Metadata = { title: "Faculty" };

export default function FacultyPageEn() {
  return (
    <>
      <PageHero
        eyebrow="FACULTY"
        title="Faculty"
        description="Introducing 32 faculty members across 6 research fields: Mechanics & Materials, Energy & Thermofluids, Robotics & Control, Design & Manufacturing, Micro & Nano, and Bio & Photonics. Click a card for contact details and lab information."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <FacultyGrid lang="en" members={faculty} />
      </section>
    </>
  );
}
