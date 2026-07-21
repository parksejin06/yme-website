"use client";

import { ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { LabMediaItem } from "@/lib/lab-media";
import type { Lang } from "@/lib/nav";

const COPY = {
  ko: { watchOn: "원본 링크에서 보기" },
  en: { watchOn: "Watch at the source" },
};

export default function LabVideoModal({ item, onClose, lang }: { item: LabMediaItem | null; onClose: () => void; lang: Lang }) {
  const t = COPY[lang];

  return (
    <Modal open={!!item} onClose={onClose} panelClassName="max-w-2xl">
      {item?.video && (
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-black">
            <iframe
              key={item.labId}
              src={item.video.embedUrl}
              title={item.labNameKo ?? item.professorName ?? "lab video"}
              className="h-full w-full"
              allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="p-5">
            <p className="font-display text-base text-ink">{item.labNameKo}</p>
            <p className="mt-1 text-sm text-ink/60">
              {item.professorName}
              {item.professorPosition ? ` ${item.professorPosition}` : ""}
            </p>
            <a
              href={item.video.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {t.watchOn} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
