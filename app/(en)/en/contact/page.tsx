import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import contact from "@/data/contact.json";

export const metadata: Metadata = { title: "Contact & Directions" };

// Approximate coordinates near the Sinchon campus main gate, not surveyed.
// Replace with an official Google Maps embed (API key) for production if precise pinning is required.
const OSM_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=126.9328%2C37.5615%2C126.9448%2C37.5715&layer=mapnik&marker=37.5665%2C126.9388";

function BusRow({ colorLabel, colorClass, routes }: { colorLabel: string; colorClass: string; routes: string[] }) {
  return (
    <div className="flex gap-4">
      <span className={`mt-0.5 h-fit shrink-0 rounded px-2 py-0.5 text-xs text-white ${colorClass}`}>
        {colorLabel}
      </span>
      <p className="text-sm text-ink/70">{routes.join(", ")}</p>
    </div>
  );
}

export default function ContactPageEn() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="Contact & Directions"
        image="/images/campus-aerial.jpg"
        imageAlt="Aerial view of Yonsei University's Sinchon campus"
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-ink">Address</h2>
            <dl className="mt-4 space-y-2 text-sm text-ink/70">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-ink/70">Address</dt>
                <dd>
                  {contact.address.en} ({contact.address.postal})
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-ink/70">Phone</dt>
                <dd>{contact.phone}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-ink/70">Email</dt>
                <dd>{contact.email}</dd>
              </div>
            </dl>

            <h2 className="mt-10 font-display text-xl text-ink">Subway</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {contact.subway.map((s) => (
                <li key={s.exit}>{s.en}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-xl text-ink">Bus Routes</h2>
            <div className="mt-4 space-y-3">
              <BusRow colorLabel="Green (Branch)" colorClass="bg-emerald-600" routes={contact.bus.green} />
              <BusRow colorLabel="Blue (Trunk)" colorClass="bg-primary" routes={contact.bus.blue} />
              <BusRow colorLabel="Red (Wide-area)" colorClass="bg-rose-600" routes={contact.bus.red} />
            </div>
          </div>

          <div className="h-[340px] overflow-hidden rounded-lg border border-line sm:h-full sm:min-h-[420px]">
            <iframe
              title="Map of Yonsei University"
              src={OSM_EMBED_SRC}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
