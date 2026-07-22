import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { ABOUT_NAV } from "@/lib/nav";
import contact from "@/data/contact.json";
import staff from "@/data/staff.json";

export const metadata: Metadata = { title: "Directions" };

const OSM_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=126.9328%2C37.5615%2C126.9448%2C37.5715&layer=mapnik&marker=37.5665%2C126.9388";

const FULL_ADDRESS = `${contact.address.en} (${contact.address.postal})`;

const MAP_LINKS = [
  { label: "Naver Map", href: `https://map.naver.com/v5/search/${encodeURIComponent(contact.address.kr)}` },
  { label: "Kakao Map", href: `https://map.kakao.com/link/search/${encodeURIComponent(contact.address.kr)}` },
  { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}` },
];

function BusRow({ colorLabel, colorClass, routes }: { colorLabel: string; colorClass: string; routes: string[] }) {
  return (
    <div className="flex gap-4">
      <span className={`mt-0.5 h-fit shrink-0 rounded px-2 py-0.5 text-xs text-white ${colorClass}`}>{colorLabel}</span>
      <p className="text-sm text-ink/70">{routes.join(", ")}</p>
    </div>
  );
}

export default function DirectionsPageEn() {
  const undergradContact = staff.find((s) => s.team === "학부 행정");
  const gradContact = staff.find((s) => s.team === "대학원");
  const bk21Contacts = staff.filter((s) => s.team === "BK21 교육연구단");

  return (
    <>
      <PageHero eyebrow="ABOUT US" title="Directions" image="/images/campus-aerial.jpg" imageAlt="Aerial view of Yonsei University's Sinchon campus" />
      <SectionSubNav items={ABOUT_NAV} lang="en" label="About sub-navigation" />
      <Breadcrumb lang="en" items={[{ label: "About", path: "/about" }, { label: "Directions" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <h2 className="font-display text-2xl text-ink">Address & Contact</h2>
            <dl className="mt-5 space-y-2.5 text-[15px] text-ink/70">
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/70">Address</dt>
                <dd>{FULL_ADDRESS}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-ink/70">Main line</dt>
                <dd>{contact.phone}</dd>
              </div>
              {undergradContact && (
                <div className="flex gap-2">
                  <dt className="w-32 shrink-0 text-ink/70">Undergraduate</dt>
                  <dd>
                    {undergradContact.phone} · {undergradContact.office}
                  </dd>
                </div>
              )}
              {gradContact && (
                <div className="flex gap-2">
                  <dt className="w-32 shrink-0 text-ink/70">Graduate</dt>
                  <dd>
                    {gradContact.phone} · {gradContact.office}
                  </dd>
                </div>
              )}
              {bk21Contacts.length > 0 && (
                <div className="flex gap-2">
                  <dt className="w-32 shrink-0 text-ink/70">BK21</dt>
                  <dd>
                    {bk21Contacts.map((s) => s.phone).join(", ")} · {bk21Contacts[0].office}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {MAP_LINKS.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink/75 transition-colors hover:border-primary hover:text-primary"
                >
                  {m.label}
                </a>
              ))}
            </div>

            <h2 className="mt-10 font-display text-2xl text-ink">Subway</h2>
            <ul className="mt-5 space-y-2.5 text-[15px] text-ink/70">
              {contact.subway.map((s) => (
                <li key={s.exit}>{s.en}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl text-ink">Bus Routes</h2>
            <div className="mt-5 space-y-3.5 text-[15px]">
              <BusRow colorLabel="Green (Local)" colorClass="bg-emerald-600" routes={contact.bus.green} />
              <BusRow colorLabel="Blue (Trunk)" colorClass="bg-primary" routes={contact.bus.blue} />
              <BusRow colorLabel="Red (Wide)" colorClass="bg-rose-600" routes={contact.bus.red} />
            </div>
          </div>

          <div className="h-[400px] overflow-hidden rounded-lg border border-line md:h-full md:min-h-[560px]">
            <iframe title="Yonsei University location map" src={OSM_EMBED_SRC} className="h-full w-full" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
