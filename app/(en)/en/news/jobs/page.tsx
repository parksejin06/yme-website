import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import JobBoard from "@/components/community/JobBoard";
import { NEWS_NAV } from "@/lib/nav";
import jobs from "@/data/jobs.json";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPageEn() {
  return (
    <>
      <PageHero eyebrow="NEWS & COMMUNITY" title="Jobs" description="Entry-level, internship, and research job postings, plus graduate research opportunities." />
      <SectionSubNav items={NEWS_NAV} lang="en" label="News & Community sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "News & Community", path: "/news" }, { label: "Jobs" }]} />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <JobBoard items={jobs} lang="en" />
      </section>
    </>
  );
}
