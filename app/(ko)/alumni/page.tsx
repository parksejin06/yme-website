import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AlumniInterviewsSection from "@/components/alumni/AlumniInterviewsSection";
import AlumniAssociationCard from "@/components/alumni/AlumniAssociationCard";
import InternationalExchangeCard from "@/components/alumni/InternationalExchangeCard";
import alumniInterviews from "@/data/alumniInterviews.json";
import alumniInfo from "@/data/alumniInfo.json";
import internationalExchange from "@/data/internationalExchange.json";

export const metadata: Metadata = { title: "동문·대외협력" };

export default function AlumniPage() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="동문·대외협력"
        description="동문 네트워크와 대외협력 소식을 안내할 예정입니다."
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI ASSOCIATION</p>
        <h2 className="mt-3 font-display text-xl text-ink">동문회</h2>

        <h3 className="mt-8 font-display text-base text-ink/80">동문 인터뷰 소식</h3>
        <div className="mt-4">
          <AlumniInterviewsSection interviews={alumniInterviews.interviews} lang="ko" />
        </div>

        <div className="mt-8">
          <AlumniAssociationCard data={alumniInfo} lang="ko" />
        </div>
      </section>

      <section className="mx-auto max-w-content border-t border-line px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">EXTERNAL PARTNERSHIPS</p>
        <h2 className="mt-3 font-display text-xl text-ink">대외협력</h2>
        <div className="mt-6">
          <InternationalExchangeCard data={internationalExchange} lang="ko" />
        </div>
      </section>
    </>
  );
}
