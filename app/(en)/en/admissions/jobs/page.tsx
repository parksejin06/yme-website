import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import JobBoard from "@/components/community/JobBoard";
import { ADMISSIONS_NAV } from "@/lib/nav";
import { BOARD_DATA } from "@/lib/community-data";
import { BOARD_META } from "@/lib/community-content";

export const metadata: Metadata = { title: "Jobs & Internships" };

export default function AdmissionsJobsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ADMISSIONS"
        title="Jobs & Internships"
        description="Job and internship postings from the department's employment information board."
      />
      <SectionSubNav items={ADMISSIONS_NAV} lang="en" label="Admissions sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "Admissions", path: "/admissions" }, { label: "Jobs & Internships" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <a
          href={BOARD_META.jobs.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View the original job board <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="mt-6">
          <JobBoard items={BOARD_DATA["jobs"]} lang="en" />
        </div>
      </section>
    </>
  );
}
