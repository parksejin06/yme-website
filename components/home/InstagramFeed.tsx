"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import type { InstagramAccount, InstagramPost } from "@/lib/social";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: {
    eyebrow: "01 / INSTAGRAM",
    title: "연세 기계공학부의 일상",
    viewOnInstagram: "Instagram에서 보기",
    hoverCta: "View on Instagram",
    reel: "REEL",
    post: "POST",
    fallbackTitle: "연세 기계공학부 Instagram에서 더 많은 이야기를 확인하세요.",
    fallbackCta: "Instagram 바로가기",
  },
  en: {
    eyebrow: "01 / INSTAGRAM",
    title: "Everyday Life at Yonsei ME",
    viewOnInstagram: "View on Instagram",
    hoverCta: "View on Instagram",
    reel: "REEL",
    post: "POST",
    fallbackTitle: "Find more stories on Yonsei Mechanical Engineering's Instagram.",
    fallbackCta: "Go to Instagram",
  },
};

function PostCard({ post, lang, featured = false }: { post: InstagramPost; lang: Lang; featured?: boolean }) {
  const t = COPY[lang];
  const [broken, setBroken] = useState(false);
  const caption = lang === "ko" ? post.captionKr : post.captionEn;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block shrink-0 snap-start overflow-hidden rounded-lg bg-surface-muted ${
        featured ? "w-[78vw] sm:w-auto sm:aspect-[4/5]" : "w-[62vw] sm:w-auto sm:aspect-square"
      }`}
    >
      {!broken ? (
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 640px) 33vw, 78vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-85"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface-muted p-4 text-center text-xs text-ink/40 sm:aspect-auto sm:h-full">
          {t.fallbackTitle}
        </div>
      )}

      <span className="absolute left-2.5 top-2.5 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
        {post.type === "reel" ? t.reel : t.post}
      </span>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1 text-xs font-medium text-white">
          {t.hoverCta} <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-8 transition-opacity duration-300 group-hover:opacity-0 sm:block">
          <p className="line-clamp-2 text-xs text-white/95">{caption}</p>
          <p className="mt-1 text-[10px] text-white/60">{post.dateLabel}</p>
        </div>
      )}
      {!caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 transition-opacity duration-300 group-hover:opacity-0">
          <p className="text-[10px] text-white/70">{post.dateLabel}</p>
        </div>
      )}
    </a>
  );
}

export default function InstagramFeed({ accounts, lang }: { accounts: InstagramAccount[]; lang: Lang }) {
  const t = COPY[lang];
  const [activeHandle, setActiveHandle] = useState(accounts[0].handle);
  const active = accounts.find((a) => a.handle === activeHandle) ?? accounts[0];

  return (
    <div>
      <p className="font-body text-xs tracking-[0.2em] text-primary/70">{t.eyebrow}</p>
      <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{t.title}</h3>

      {/* Account selector */}
      <div className="mt-6 flex gap-1 overflow-x-auto overflow-y-hidden sm:flex-wrap">
        {accounts.map((a) => (
          <button
            key={a.handle}
            onClick={() => setActiveHandle(a.handle)}
            className={`min-h-11 shrink-0 rounded-md px-4 text-left transition-colors ${
              activeHandle === a.handle ? "bg-primary text-white" : "bg-surface-muted text-ink/70 hover:bg-line/60"
            }`}
          >
            <span className="block text-sm font-display leading-tight">@{a.handle}</span>
            <span className={`block text-[11px] leading-tight ${activeHandle === a.handle ? "text-white/70" : "text-ink/45"}`}>
              {lang === "ko" ? a.nameKr : a.nameEn}
            </span>
          </button>
        ))}
      </div>

      {/* Account info */}
      <div className="mt-6 flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <InstagramIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-sm text-ink">
              @{active.handle}
              <span className="ml-2 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-ink/50">
                {lang === "ko" ? active.labelKr : active.labelEn}
              </span>
            </p>
            <p className="mt-1 max-w-md text-sm text-ink/60">{lang === "ko" ? active.descriptionKr : active.descriptionEn}</p>
          </div>
        </div>
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-sm border border-line px-4 py-2 text-xs font-medium text-ink/75 transition-colors hover:border-primary hover:text-primary sm:self-auto"
        >
          {t.viewOnInstagram} <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Post preview */}
      <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {active.posts.map((post, i) => (
          <PostCard key={post.permalink} post={post} lang={lang} featured={i === 0} />
        ))}
      </div>
    </div>
  );
}
