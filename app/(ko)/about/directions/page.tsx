import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionSubNav from "@/components/SectionSubNav";
import Breadcrumb from "@/components/Breadcrumb";
import { ABOUT_NAV } from "@/lib/nav";
import contact from "@/data/contact.json";
import staff from "@/data/staff.json";

export const metadata: Metadata = { title: "오시는 길" };

// 정확한 위경도가 아닌 신촌 캠퍼스 정문 인근 근사 좌표입니다.
// 정밀한 위치가 필요하면 Google Maps API 키 발급 후 공식 임베드로 교체 권장.
const OSM_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=126.9328%2C37.5615%2C126.9448%2C37.5715&layer=mapnik&marker=37.5665%2C126.9388";

const FULL_ADDRESS = `${contact.address.kr} (${contact.address.postal})`;

const MAP_LINKS = [
  { label: "네이버 지도에서 보기", href: `https://map.naver.com/v5/search/${encodeURIComponent(FULL_ADDRESS)}` },
  { label: "카카오맵에서 보기", href: `https://map.kakao.com/link/search/${encodeURIComponent(FULL_ADDRESS)}` },
  { label: "Google Maps에서 보기", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}` },
];

function BusRow({ colorLabel, colorClass, routes }: { colorLabel: string; colorClass: string; routes: string[] }) {
  return (
    <div className="flex gap-4">
      <span className={`mt-0.5 h-fit shrink-0 rounded px-2 py-0.5 text-xs text-white ${colorClass}`}>{colorLabel}</span>
      <p className="text-sm text-ink/70">{routes.join(", ")}</p>
    </div>
  );
}

export default function DirectionsPage() {
  const 학부연락처 = staff.find((s) => s.team === "학부 행정");
  const 대학원연락처 = staff.find((s) => s.team === "대학원");
  const bk21연락처 = staff.filter((s) => s.team === "BK21 교육연구단");

  return (
    <>
      <PageHero eyebrow="ABOUT US" title="오시는 길" image="/images/campus-aerial.jpg" imageAlt="연세대학교 신촌캠퍼스 항공뷰" />
      <SectionSubNav items={ABOUT_NAV} lang="ko" label="학부소개 서브 내비게이션" />
      <Breadcrumb lang="ko" items={[{ label: "학부소개", path: "/about" }, { label: "오시는 길" }]} />

      <section className="mx-auto max-w-wide px-[var(--page-gutter)] py-[var(--section-space)]">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <h2 className="font-display text-2xl text-ink">주소·연락처</h2>
            <dl className="mt-5 space-y-2.5 text-[15px] text-ink/70">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-ink/70">주소</dt>
                <dd>{FULL_ADDRESS}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-ink/70">대표 전화</dt>
                <dd>{contact.phone}</dd>
              </div>
              {학부연락처 && (
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-ink/70">학부</dt>
                  <dd>
                    {학부연락처.phone} · {학부연락처.office}
                  </dd>
                </div>
              )}
              {대학원연락처 && (
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-ink/70">대학원</dt>
                  <dd>
                    {대학원연락처.phone} · {대학원연락처.office}
                  </dd>
                </div>
              )}
              {bk21연락처.length > 0 && (
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-ink/70">BK21</dt>
                  <dd>
                    {bk21연락처.map((s) => s.phone).join(", ")} · {bk21연락처[0].office}
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

            <h2 className="mt-10 font-display text-2xl text-ink">지하철 출구안내</h2>
            <ul className="mt-5 space-y-2.5 text-[15px] text-ink/70">
              {contact.subway.map((s) => (
                <li key={s.exit}>{s.kr}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl text-ink">버스 노선</h2>
            <div className="mt-5 space-y-3.5 text-[15px]">
              <BusRow colorLabel="초록 (지선)" colorClass="bg-emerald-600" routes={contact.bus.green} />
              <BusRow colorLabel="파랑 (간선)" colorClass="bg-primary" routes={contact.bus.blue} />
              <BusRow colorLabel="빨강 (광역)" colorClass="bg-rose-600" routes={contact.bus.red} />
            </div>
          </div>

          <div className="h-[400px] overflow-hidden rounded-lg border border-line md:h-full md:min-h-[560px]">
            <iframe title="연세대학교 위치 지도" src={OSM_EMBED_SRC} className="h-full w-full" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
