import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Alumni & Partnerships" };

export default function AlumniPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="Alumni · External Partnerships"
        description="News on the alumni network and industry / external partnerships will be provided here."
      />
      <PlaceholderPage
        lang="en"
        sections={["Alumni Association", "Alumni Interviews & News", "Industry-Academia Collaboration", "Partnerships & MOUs"]}
      />
    </>
  );
}
