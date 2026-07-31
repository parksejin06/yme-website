import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { Attachment } from "@/lib/community-content";
import { MAX_UPLOAD_BYTES } from "./upload-limits";

export { MAX_UPLOAD_BYTES };

/**
 * Uploads a single file and returns its public URL + size, or `null` if no
 * file was submitted. Vercel's serverless functions have a read-only
 * filesystem at runtime, so a plain fs write silently won't persist in
 * production -- when BLOB_READ_WRITE_TOKEN is configured (Production/Preview,
 * and locally if pulled into .env.local), this uploads to Vercel Blob
 * instead. Falls back to writing under `public/<dir>/` only when no Blob
 * token is present, so local dev keeps working with zero extra setup.
 */
export async function uploadFile(file: File, dir: string): Promise<{ url: string; size: number }> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`파일이 너무 큽니다: ${file.name} (최대 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB).`);
  }

  const ext = path.extname(file.name) || "";
  const filename = `${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${dir}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { url: blob.url, size: file.size };
  }

  const targetDir = path.join(process.cwd(), "public", dir);
  fs.mkdirSync(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(targetDir, filename), buffer);
  return { url: `/${dir}/${filename}`, size: file.size };
}

/** Thin wrapper over {@link uploadFile} for the single-photo admin forms
 * (faculty / emeritus), which only ever store a URL string as photoPath. */
export async function uploadPhoto(file: FormDataEntryValue | null, dir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const { url } = await uploadFile(file, dir);
  return url;
}

/** Uploads every non-empty File in `files` and returns them as community-post
 * Attachment records (fileUrl set to the uploaded URL, localPath left null
 * since these aren't scraped/mirrored copies). Also enforces a combined size
 * cap across all files in one submission, on top of uploadFile's per-file cap,
 * since Vercel's request-body limit applies to the whole multipart body. */
export async function uploadAttachments(files: File[], dir: string): Promise<Attachment[]> {
  const real = files.filter((f) => f.size > 0);
  const totalSize = real.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > MAX_UPLOAD_BYTES) {
    throw new Error(`첨부파일 전체 용량이 너무 큽니다 (최대 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB).`);
  }

  const uploaded: Attachment[] = [];
  for (const file of real) {
    const { url, size } = await uploadFile(file, dir);
    uploaded.push({
      fileName: file.name,
      fileUrl: url,
      fileType: file.type || null,
      localPath: null,
      fileSize: size,
    });
  }
  return uploaded;
}
