import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AlumniInterviewsSection from "@/components/alumni/AlumniInterviewsSection";
import AlumniAssociationCard from "@/components/alumni/AlumniAssociationCard";
import InternationalExchangeCard from "@/components/alumni/InternationalExchangeCard";
import alumniInterviews from "@/data/alumniInterviews.json";
import alumniInfo from "@/data/alumniInfo.json";
import internationalExchange from "@/data/internationalExchange.json";

export const metadata: Metadata = { title: "Alumni & Partnerships" };

export default function AlumniPageEn() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="Alumni · External Partnerships"
        description="News on the alumni network and external partnerships will be provided here."
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI ASSOCIATION</p>
        <h2 className="mt-3 font-display text-xl text-ink">Alumni Association</h2>

        <h3 className="mt-8 font-display text-base text-ink/80">Alumni Interviews & News</h3>
        <div className="mt-4">
          <AlumniInterviewsSection interviews={alumniInterviews.interviews} lang="en" />
        </div>

        <div className="mt-8">
          <AlumniAssociationCard data={alumniInfo} lang="en" />
        </div>
      </section>

      <section className="mx-auto max-w-content border-t border-line px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">EXTERNAL PARTNERSHIPS</p>
        <h2 className="mt-3 font-display text-xl text-ink">External Partnerships</h2>
        <div className="mt-6">
          <InternationalExchangeCard data={internationalExchange} lang="en" />
        </div>
      </section>
    </>
  );
}
