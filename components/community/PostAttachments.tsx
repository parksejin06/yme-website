import { Download } from "lucide-react";
import type { Attachment } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

function formatSize(bytes?: number): string | null {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(a: Attachment): boolean {
  return (a.fileType ?? "").startsWith("image/");
}

export default function PostAttachments({ attachments, lang }: { attachments: Attachment[]; lang: Lang }) {
  if (attachments.length === 0) return null;
  const label = lang === "ko" ? "첨부파일" : "Attachments";
  const images = attachments.filter(isImage);
  const files = attachments.filter((a) => !isImage(a));

  return (
    <div className="mt-6 flex flex-col gap-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((a) => (
            <a
              key={a.fileUrl}
              href={a.localPath || a.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg border border-line bg-surface-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- attachments can come from
                  varied hosts (scraped originals, Vercel Blob), not worth allowlisting every domain */}
              <img
                src={a.localPath || a.fileUrl}
                alt={a.fileName}
                className="aspect-video w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="rounded-lg border border-line bg-surface-muted/60 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
          <ul className="space-y-1.5">
            {files.map((a) => {
              const href = a.localPath || a.fileUrl;
              const size = formatSize(a.fileSize);
              return (
                <li key={a.fileUrl}>
                  <a
                    href={href}
                    download={!!a.localPath}
                    target={a.localPath ? undefined : "_blank"}
                    rel={a.localPath ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    <span className="break-all">{a.fileName}</span>
                    {size && <span className="shrink-0 text-xs text-ink/40">({size})</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
