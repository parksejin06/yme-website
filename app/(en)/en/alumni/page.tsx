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
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI ASSOCIATION</p>
        <h2 className="mt-3 font-display text-xl text-ink">Alumni Association</h2>
        <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="font-display text-ink/70">Alumni Interviews &amp; News</p>
            <p className="mt-2 text-sm text-ink/70">[Content to be provided]</p>
          </div>

          <AlumniAssociationCard data={alumniInfo} lang="en" />
        </div>

        <div className="mt-16 border-t border-line pt-16">
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">EXTERNAL PARTNERSHIPS</p>
          <h2 className="mt-3 font-display text-xl text-ink">External Partnerships</h2>
          <div className="mt-6 space-y-4">
            <IndustryCollaborationCard data={industryPartners} lang="en" />
            <GlobalPartnershipsCard data={globalPartnerships} lang="en" />
          </div>
        </div>
      </section>
    </>
  );
}
