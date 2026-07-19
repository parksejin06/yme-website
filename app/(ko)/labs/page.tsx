import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import labs from "@/data/labs.json";

export const metadata: Metadata = { title: "연구실·연구분야 소개" };

type Lab = {
  slug: string;
  professorKr: string;
  labNameKr: string;
  office: string;
  tel: string;
  email: string;
  url: string | null;
  researchAreaKr: string[];
  images: { src: string; alt: string }[];
};

const typedLabs = labs as Lab[];

export default function LabsPage() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="연구실·연구분야 소개"
        description="연세대학교 기계공학부는 26개 연구실에서 정밀·설계, 열유체, 로봇·메카트로닉스, 재료·구조, 나노·바이오, 에너지 등 폭넓은 분야를 연구합니다. 연구실별 상세 정보는 순차적으로 업데이트될 예정입니다."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        {typedLabs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center text-ink/70">
            연구실 상세 정보는 추후 제공 예정입니다. (교수 성함, 연구실명, OFFICE, TEL, Email, Research Area,
            연구실 URL 및 대표 이미지가 이 자리에 카드 형태로 표시됩니다.)
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {typedLabs.map((lab) => (
              <article key={lab.slug} className="overflow-hidden rounded-lg border border-line">
                {lab.images[0] && (
                  <Image
                    src={lab.images[0].src}
                    alt={lab.images[0].alt}
                    width={480}
                    height={320}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h2 className="font-display text-base text-ink">{lab.labNameKr}</h2>
                  <p className="mt-1 text-sm text-primary">{lab.professorKr}</p>
                  <p className="mt-3 text-xs text-ink/70">{lab.office}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
