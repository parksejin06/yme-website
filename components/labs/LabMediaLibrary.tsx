"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Play, FlaskConical, ExternalLink } from "lucide-react";
import LabVideoModal from "./LabVideoModal";
import TabRow from "@/components/ui/TabRow";
import SearchField from "@/components/ui/SearchField";
import type { LabMediaItem } from "@/lib/lab-media";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    all: "전체",
    video: "소개 영상",
    image: "홍보 이미지",
    search: "교수명 또는 연구실명 검색",
    noResults: "검색 결과가 없습니다.",
    videoLabel: "VIDEO",
    imageLabel: "IMAGE",
    labProfile: "지도교수 보기",
    labSite: "연구실 홈페이지",
    watchVideo: "영상 보기",
  },
  en: {
    all: "All",
    video: "Video",
    image: "Photo",
    search: "Search by professor or lab name",
    noResults: "No results found.",
    videoLabel: "VIDEO",
    imageLabel: "IMAGE",
    labProfile: "View faculty profile",
    labSite: "Lab website",
    watchVideo: "Watch video",
  },
};

function MediaFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-muted px-3 text-center">
      <FlaskConical className="h-7 w-7 text-primary/30" aria-hidden="true" />
      <span className="line-clamp-2 text-xs font-medium text-ink/50">{label}</span>
    </div>
  );
}

function LabCard({ item, lang, onPlay }: { item: LabMediaItem; lang: Lang; onPlay: () => void }) {
  const t = COPY[lang];
  const thumb = item.video?.localThumbnail || item.video?.thumbnailUrl || item.localPromoImage;
  const name = item.labNameKo || item.professorName || "";

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-line">
      <button
        type="button"
        onClick={item.mediaType === "video" ? onPlay : undefined}
        className={`group relative block aspect-video w-full overflow-hidden bg-ink/5 ${item.mediaType === "video" ? "cursor-pointer" : "cursor-default"}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        ) : (
          <MediaFallback label={name} />
        )}
        <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
          {item.mediaType === "video" ? t.videoLabel : t.imageLabel}
        </span>
        {item.mediaType === "video" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow transition-opacity group-hover:opacity-100">
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            </span>
          </span>
        )}
      </button>
      <div className="p-4">
        <p className="line-clamp-2 font-display text-sm text-ink">{name}</p>
        <p className="mt-1 text-xs text-ink/50">
          {item.professorName}
          {item.professorPosition ? ` ${item.professorPosition}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {item.matchedFacultySlug && (
            <Link href={`/faculty/${item.matchedFacultySlug}`} className="text-primary hover:underline">
              {t.labProfile}
            </Link>
          )}
          {item.labWebsite && (
            <a href={item.labWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink/50 hover:text-primary">
              {t.labSite} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LabMediaLibrary({ items, lang }: { items: LabMediaItem[]; lang: Lang }) {
  const t = COPY[lang];
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "image">("all");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<LabMediaItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (typeFilter !== "all" && i.mediaType !== typeFilter) return false;
      if (!q) return true;
      return (i.professorName ?? "").toLowerCase().includes(q) || (i.labNameKo ?? "").toLowerCase().includes(q);
    });
  }, [items, typeFilter, query]);

  const featured = useMemo(() => filtered.find((i) => i.mediaType === "video") ?? null, [filtered]);
  const rest = filtered.filter((i) => i !== featured);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <TabRow
          ariaLabel={lang === "ko" ? "미디어 유형" : "Media type"}
          size="sm"
          value={typeFilter}
          onChange={(v) => setTypeFilter(v as "all" | "video" | "image")}
          items={[
            { value: "all", label: t.all },
            { value: "video", label: t.video },
            { value: "image", label: t.image },
          ]}
        />
        <SearchField value={query} onChange={setQuery} placeholder={t.search} className="w-full sm:w-80" />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/40">{t.noResults}</p>
      ) : (
        <div className="mt-8">
          {featured && (
            <div className="mb-8">
              <div className="grid gap-0 overflow-hidden rounded-2xl border border-line sm:grid-cols-[1.4fr_1fr]">
                <button
                  type="button"
                  onClick={() => setPlaying(featured)}
                  className="group relative block aspect-video w-full overflow-hidden bg-ink/5"
                >
                  {(featured.video?.localThumbnail || featured.video?.thumbnailUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.video?.localThumbnail || featured.video?.thumbnailUrl || ""}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <MediaFallback label={featured.labNameKo ?? ""} />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow">
                      <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                    </span>
                  </span>
                </button>
                <div className="flex min-w-0 flex-col justify-center p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-primary/70">{t.videoLabel}</span>
                  <p className="mt-2 font-display text-lg text-ink">{featured.labNameKo}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {featured.professorName}
                    {featured.professorPosition ? ` ${featured.professorPosition}` : ""}
                  </p>
                  <button
                    onClick={() => setPlaying(featured)}
                    className="mt-4 inline-flex h-12 w-fit items-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-white hover:bg-primary-strong"
                  >
                    <Play className="h-3.5 w-3.5" fill="currentColor" /> {t.watchVideo}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((item) => (
              <LabCard key={item.labId} item={item} lang={lang} onPlay={() => setPlaying(item)} />
            ))}
          </div>
        </div>
      )}

      <LabVideoModal item={playing} onClose={() => setPlaying(null)} lang={lang} />
    </div>
  );
}
