import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AlumniAssociationCard from "@/components/alumni/AlumniAssociationCard";
import IndustryCollaborationCard from "@/components/alumni/IndustryCollaborationCard";
import GlobalPartnershipsCard from "@/components/alumni/GlobalPartnershipsCard";
import alumniInfo from "@/data/alumniInfo.json";
import industryPartners from "@/data/industryPartners.json";
import globalPartnerships from "@/data/globalPartnerships.json";

export const metadata: Metadata = { title: "Alumni & Partnerships" };

export default function AlumniPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="Alumni · External Partnerships"
        description="News on the alumni network and industry / external partnerships will be provided here."
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <AlumniAssociationCard data={alumniInfo} lang="en" />

          <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="font-display text-ink/70">Alumni Interviews &amp; News</p>
            <p className="mt-2 text-sm text-ink/70">[Content to be provided]</p>
          </div>
        </div>

        <div className="mt-4">
          <IndustryCollaborationCard data={industryPartners} lang="en" />
        </div>

        <div className="mt-4">
          <GlobalPartnershipsCard data={globalPartnerships} lang="en" />
        </div>
      </section>
    </>
  );
}
