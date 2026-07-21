import { Download } from "lucide-react";
import type { Attachment } from "@/lib/community-content";
import type { Lang } from "@/lib/nav";

function formatSize(bytes?: number): string | null {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PostAttachments({ attachments, lang }: { attachments: Attachment[]; lang: Lang }) {
  if (attachments.length === 0) return null;
  const label = lang === "ko" ? "첨부파일" : "Attachments";

  return (
    <div className="mt-6 rounded-lg border border-line bg-surface-muted/60 p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      <ul className="space-y-1.5">
        {attachments.map((a) => {
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
  );
}
