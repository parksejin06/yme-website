import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { HomeIcon, ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";
import { fieldLabel, positionLabel } from "@/lib/faculty";
import { getFaculty } from "@/lib/faculty-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getFaculty()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = (await getFaculty()).find((m) => m.slug === slug);
  return { title: member ? member.name : "Faculty" };
}

export default async function FacultyDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = (await getFaculty()).find((m) => m.slug === slug);
  if (!member) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-strong px-4 pb-14 pt-[calc(var(--utility-bar-h)+6.5rem)] sm:px-6 sm:pb-20 sm:pt-[calc(var(--utility-bar-h)+8rem)]">
        <div className="mx-auto max-w-content">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/70">
            <Link href="/en" className="flex items-center hover:text-white" aria-label="Home">
              <HomeIcon className="h-4 w-4" />
            </Link>
            <ChevronRightIcon />
            <Link href="/en/faculty" className="hover:text-white">
              Faculty
            </Link>
            <ChevronRightIcon />
            <span className="text-white">{member.name}</span>
          </nav>
          <h1 className="mt-6 font-display text-white" style={{ fontSize: "clamp(2rem, 3vw, 3.25rem)" }}>
            {member.name}
          </h1>
          <p className="mt-3 text-lg text-white/70">{positionLabel(member.position, "en")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <ScrollReveal className="grid gap-10 sm:grid-cols-[260px_1fr] sm:gap-14">
          <div className="mx-auto h-64 w-64 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:mx-0 sm:h-auto sm:w-full">
            {member.photoPath && (
              <Image
                src={member.photoPath}
                alt={`Portrait of ${member.name}`}
                width={520}
                height={640}
                priority
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 text-ink/50">Name</dt>
              <dd className="text-ink">{member.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 text-ink/50">Position</dt>
              <dd className="text-ink">{positionLabel(member.position, "en")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 text-ink/50">Phone</dt>
              <dd className="text-ink">{member.phone ?? "Not listed"}</dd>
            </div>
            {member.email && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/50">Email</dt>
                <dd>
                  <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                    {member.email}
                  </a>
                </dd>
              </div>
            )}
            {member.office && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/50">Office</dt>
                <dd className="text-ink">{member.office}</dd>
              </div>
            )}
            {member.field && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/50">Research Field</dt>
                <dd className="text-ink">{fieldLabel(member.field, "en")}</dd>
              </div>
            )}
            {member.labName && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/50">Lab</dt>
                <dd className="text-ink">{member.labName}</dd>
              </div>
            )}
            {member.labUrl && (
              <div className="pt-2">
                <a
                  href={member.labUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-sm border border-primary px-5 py-2 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Lab website →
                </a>
              </div>
            )}
          </dl>
        </ScrollReveal>

        <Link
          href="/en/faculty"
          className="mt-14 inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-primary"
        >
          <ArrowLeftIcon /> Back to faculty list
        </Link>
      </section>
    </>
  );
}
