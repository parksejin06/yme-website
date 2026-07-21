import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import AdmissionTypeTabs from "@/components/admissions/AdmissionTypeTabs";
import { ADMISSIONS_NAV } from "@/lib/nav";
import admissionsInfo from "@/data/admissions-info.json";

export const metadata: Metadata = { title: "Admission Guide" };

export default function AdmissionsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="New & Transfer Admissions"
        description="An overview of admission tracks at Yonsei Mechanical Engineering, with links to each track's official guide."
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="en" label="Admissions sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Admissions" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ABOUT THE PROGRAM</p>
        <p className="mt-4 max-w-2xl text-ink/70">{admissionsInfo.overviewEn}</p>
        <p className="mt-3 max-w-2xl text-ink/70">
          New-student admissions are divided into Susi (holistic/academic-record review) and Jeongsi (CSAT-based)
          tracks, while transfer students are admitted through a separate track. Exact quotas, the weighting of
          evaluation elements, and CSAT minimum requirements can change every year, so please always confirm them
          through the official Yonsei Admissions Office guide linked below for each track.
        </p>

        <div className="mt-10">
          <AdmissionTypeTabs types={admissionsInfo.admissionTypes} lang="en" />
        </div>
      </section>
    </>
  );
}
