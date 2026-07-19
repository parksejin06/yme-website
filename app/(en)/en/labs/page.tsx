import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import labs from "@/data/labs.json";

export const metadata: Metadata = { title: "Research Labs" };

type Lab = {
  slug: string;
  professorEn: string;
  labNameEn: string;
  office: string;
  tel: string;
  email: string;
  url: string | null;
  researchAreaEn: string[];
  images: { src: string; alt: string }[];
};

const typedLabs = labs as Lab[];

export default function LabsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="RESEARCH"
        title="Research Labs"
        description="Yonsei University's School of Mechanical Engineering conducts research across 26 laboratories in fields including precision & design, thermofluids, robotics & mechatronics, materials & structures, nano/bio, and energy. Detailed laboratory pages will be added progressively."
      />
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        {typedLabs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center text-ink/70">
            Laboratory details will be provided soon. (Professor name, lab name, office, tel, email, research
            area, lab URL, and a representative image will appear here as cards.)
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
                  <h2 className="font-display text-base text-ink">{lab.labNameEn}</h2>
                  <p className="mt-1 text-sm text-primary">{lab.professorEn}</p>
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
