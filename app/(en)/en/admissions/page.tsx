import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Admissions & Careers" };

export default function AdmissionsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS & CAREERS"
        title="Admissions · Graduate Studies · Careers"
        description="Information on new/transfer admissions, graduate studies, and career outcomes will be added progressively."
      />
      <PlaceholderPage
        lang="en"
        sections={[
          "New & Transfer Admissions",
          "Graduate School Admissions",
          "Career Outcomes",
          "Recruiting & Internships",
        ]}
      />
    </>
  );
}
