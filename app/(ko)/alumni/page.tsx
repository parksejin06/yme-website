import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AlumniAssociationCard from "@/components/alumni/AlumniAssociationCard";
import IndustryCollaborationCard from "@/components/alumni/IndustryCollaborationCard";
import GlobalPartnershipsCard from "@/components/alumni/GlobalPartnershipsCard";
import alumniInfo from "@/data/alumniInfo.json";
import industryPartners from "@/data/industryPartners.json";
import globalPartnerships from "@/data/globalPartnerships.json";

export const metadata: Metadata = { title: "동문·대외협력" };

export default function AlumniPage() {
  return (
    <>
      <PageHero
        eyebrow="ALUMNI & PARTNERSHIPS"
        title="동문·대외협력"
        description="동문 네트워크와 산학협력·대외협력 소식을 안내할 예정입니다."
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-body text-sm tracking-[0.2em] text-primary/70">ALUMNI ASSOCIATION</p>
        <h2 className="mt-3 font-display text-xl text-ink">동문회</h2>
        <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="font-display text-ink/70">동문 인터뷰·소식</p>
            <p className="mt-2 text-sm text-ink/70">[추후 제공 예정]</p>
          </div>

          <AlumniAssociationCard data={alumniInfo} lang="ko" />
        </div>

        <div className="mt-16 border-t border-line pt-16">
          <p className="font-body text-sm tracking-[0.2em] text-primary/70">EXTERNAL PARTNERSHIPS</p>
          <h2 className="mt-3 font-display text-xl text-ink">대외협력</h2>
          <div className="mt-6 space-y-4">
            <IndustryCollaborationCard data={industryPartners} lang="ko" />
            <GlobalPartnershipsCard data={globalPartnerships} lang="ko" />
          </div>
        </div>
      </section>
    </>
  );
}
