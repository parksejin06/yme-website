import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Uploads an admin-submitted photo and returns the path/URL to store as
 * photoPath, or `null` if no file was submitted. Vercel's serverless
 * functions have a read-only filesystem at runtime, so a plain fs write
 * silently won't persist in production -- when BLOB_READ_WRITE_TOKEN is
 * configured (Production/Preview, and locally if pulled into .env.local),
 * this uploads to Vercel Blob and returns its public URL instead. Falls
 * back to writing under `public/<dir>/` only when no Blob token is present,
 * so local dev keeps working with zero extra setup.
 */
export async function uploadPhoto(file: FormDataEntryValue | null, dir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(`사진 파일이 너무 큽니다 (최대 ${MAX_PHOTO_BYTES / 1024 / 1024}MB).`);
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${dir}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const targetDir = path.join(process.cwd(), "public", dir);
  fs.mkdirSync(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(targetDir, filename), buffer);
  return `/${dir}/${filename}`;
}
