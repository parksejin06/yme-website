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
        image="/images/new_mainbg/연구실_배경사진.jpg"
        imageAlt="Yonsei University's eagle statue at night" imagePosition="center 88%"
      />
      <SectionSubNav items={LABS_NAV} lang="en" label="Research Labs sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Research Labs", path: "/labs" }, { label: "Lab Media" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <LabMediaLibrary items={data.items} lang="en" />
      </section>
    </>
  );
}
