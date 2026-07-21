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
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <AlumniAssociationCard data={alumniInfo} lang="ko" />

          <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="font-display text-ink/70">동문 인터뷰·소식</p>
            <p className="mt-2 text-sm text-ink/70">[추후 제공 예정]</p>
          </div>
        </div>

        <div className="mt-4">
          <IndustryCollaborationCard data={industryPartners} lang="ko" />
        </div>

        <div className="mt-4">
          <GlobalPartnershipsCard data={globalPartnerships} lang="ko" />
        </div>
      </section>
    </>
  );
}
