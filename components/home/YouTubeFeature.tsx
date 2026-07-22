"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import { YoutubeIcon } from "@/components/icons";
import type { YouTubeData, YouTubeVideo } from "@/lib/social";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    eyebrow: "02 / YOUTUBE",
    title: "연구와 캠퍼스를 영상으로",
    watch: "YouTube에서 보기",
    recent: "최신 영상",
    fallback: "영상을 불러오지 못했습니다.",
  },
  en: {
    eyebrow: "02 / YOUTUBE",
    title: "Research and Campus Life, on Video",
    watch: "Watch on YouTube",
    recent: "Recent Videos",
    fallback: "This video couldn't load.",
  },
};

function Thumbnail({ video, onError }: { video: YouTubeVideo; onError: () => void }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <div className="flex h-full w-full items-center justify-center bg-surface-muted text-xs text-ink/40">{video.titleKr}</div>;
  }
  return (
    <Image
      src={video.thumbnail}
      alt=""
      fill
      sizes="(min-width: 640px) 65vw, 100vw"
      className="object-cover"
      onError={() => {
        setBroken(true);
        onError();
      }}
    />
  );
}

export default function YouTubeFeature({ data, lang }: { data: YouTubeData; lang: Lang }) {
  const t = COPY[lang];
  const [active, setActive] = useState<YouTubeVideo>(data.featured);
  const [playing, setPlaying] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);

  function selectVideo(v: YouTubeVideo) {
    setActive(v);
    setPlaying(false);
    setEmbedFailed(false);
  }

  return (
    <div>
      <p className="font-body text-xs tracking-[0.2em] text-primary/70">{t.eyebrow}</p>
      <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{t.title}</h3>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        {/* Featured player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-ink sm:w-[65%]">
          {playing && !embedFailed ? (
            <iframe
              key={active.videoId}
              src={`https://www.youtube-nocookie.com/embed/${active.videoId}?autoplay=1&rel=0`}
              title={lang === "ko" ? active.titleKr : active.titleEn}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              onError={() => setEmbedFailed(true)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex items-center justify-center"
              aria-label={lang === "ko" ? "영상 재생" : "Play video"}
            >
              <Thumbnail video={active} onError={() => setEmbedFailed(true)} />
              <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/40" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors group-hover:bg-white">
                <Play className="ml-1 h-6 w-6 fill-primary text-primary" />
              </span>
            </button>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col justify-center sm:w-[35%]">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-ink/55">
            <YoutubeIcon className="h-3.5 w-3.5" /> YonMech
          </span>
          <h4 className="mt-3 font-display text-base text-ink sm:text-lg">{lang === "ko" ? active.titleKr : active.titleEn}</h4>
          <p className="mt-2 text-xs text-ink/45">{active.dateLabel}</p>
          <a
            href={`https://youtu.be/${active.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1 rounded-sm border border-line px-4 py-2 text-xs font-medium text-ink/75 transition-colors hover:border-primary hover:text-primary"
          >
            {t.watch} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Recent list */}
      <div className="mt-8">
        <p className="text-xs font-medium tracking-wide text-ink/45">{t.recent}</p>
        <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {data.recent.map((v) => (
            <button
              key={v.videoId}
              onClick={() => selectVideo(v)}
              className={`w-[45vw] shrink-0 snap-start rounded-lg text-left transition-colors sm:w-auto ${
                active.videoId === v.videoId ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
                <Thumbnail video={v} onError={() => {}} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-ink/80">{lang === "ko" ? v.titleKr : v.titleEn}</p>
              <p className="mt-0.5 text-[10px] text-ink/40">{v.dateLabel}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
