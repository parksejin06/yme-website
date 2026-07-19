import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import contact from "@/data/contact.json";

export const metadata: Metadata = { title: "연락처·오시는 길" };

// 정확한 위경도가 아닌 신촌 캠퍼스 정문 인근 근사 좌표입니다.
// 정밀한 위치가 필요하면 Google Maps API 키 발급 후 공식 임베드로 교체 권장.
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

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="연락처·오시는 길"
        image="/images/campus-aerial.jpg"
        imageAlt="연세대학교 신촌캠퍼스 항공뷰"
      />

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-ink">주소 안내</h2>
            <dl className="mt-4 space-y-2 text-sm text-ink/70">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/70">주소</dt>
                <dd>
                  {contact.address.kr} ({contact.address.postal})
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/70">전화</dt>
                <dd>{contact.phone}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-ink/70">이메일</dt>
                <dd>{contact.email}</dd>
              </div>
            </dl>

            <h2 className="mt-10 font-display text-xl text-ink">지하철 출구안내</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {contact.subway.map((s) => (
                <li key={s.exit}>{s.kr}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-xl text-ink">버스 노선</h2>
            <div className="mt-4 space-y-3">
              <BusRow colorLabel="초록 (지선)" colorClass="bg-emerald-600" routes={contact.bus.green} />
              <BusRow colorLabel="파랑 (간선)" colorClass="bg-primary" routes={contact.bus.blue} />
              <BusRow colorLabel="빨강 (광역)" colorClass="bg-rose-600" routes={contact.bus.red} />
            </div>
          </div>

          <div className="h-[340px] overflow-hidden rounded-lg border border-line sm:h-full sm:min-h-[420px]">
            <iframe
              title="연세대학교 위치 지도"
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
