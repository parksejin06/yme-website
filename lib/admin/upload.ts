import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Uploads an admin-submitted photo and returns the path/URL to store as
 * photoPath, or `null` if no file was submitted. Uses Vercel Blob when
 * `BLOB_READ_WRITE_TOKEN` is configured (production -- Vercel's serverless
 * functions can't write to the filesystem), falling back to writing straight
 * into `public/<dir>/` for local dev with zero extra setup, same pattern as
 * the Redis fallback in lib/redis.ts.
 */
export async function uploadPhoto(file: FormDataEntryValue | null, dir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(`사진 파일이 너무 큽니다 (최대 ${MAX_PHOTO_BYTES / 1024 / 1024}MB).`);
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${dir}/${filename}`, file, { access: "public" });
    return blob.url;
  }

  const targetDir = path.join(process.cwd(), "public", dir);
  fs.mkdirSync(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(targetDir, filename), buffer);
  return `/${dir}/${filename}`;
}
