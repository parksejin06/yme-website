import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabMediaLibrary from "@/components/labs/LabMediaLibrary";
import { LABS_NAV } from "@/lib/nav";
import labMediaData from "@/data/labs-media.json";
import type { LabMediaFile } from "@/lib/lab-media";

export const metadata: Metadata = { title: "Lab Media" };

const data = labMediaData as LabMediaFile;

export default function LabsMediaPageEn() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="Lab Introduction Media"
        description="Browse video and photo introductions from Yonsei ME research labs to explore research topics and the research environment."
      />
      <SectionSubNav items={LABS_NAV} lang="en" label="Research Labs sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Research Labs", path: "/labs" }, { label: "Lab Media" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <LabMediaLibrary items={data.items} lang="en" />
      </section>
    </>
  );
}
