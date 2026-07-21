import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import LabMediaLibrary from "@/components/graduate/LabMediaLibrary";
import { GRADUATE_NAV } from "@/lib/nav";
import labMediaData from "@/data/graduate-lab-media.json";
import type { LabMediaFile } from "@/lib/lab-media";

export const metadata: Metadata = { title: "Lab Media" };

const data = labMediaData as LabMediaFile;

export default function LabMediaPageEn() {
  return (
    <>
      <PageHero
        eyebrow="GRADUATE LAB MEDIA"
        title="Graduate Lab Introduction Media"
        description="Browse video and photo introductions from Yonsei ME research labs to explore research topics and the graduate research environment."
      />
      <SectionSubNav items={GRADUATE_NAV} lang="en" label="Graduate sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Graduate", path: "/graduate" }, { label: "Lab Media" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <LabMediaLibrary items={data.items} lang="en" />
      </section>
    </>
  );
}
