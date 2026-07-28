import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Uploads an admin-submitted photo and returns the path to store as
 * photoPath, or `null` if no file was submitted. Writes straight into
 * `public/<dir>/` -- works for local dev with zero extra setup. NOTE:
 * Vercel's serverless functions have a read-only filesystem at runtime, so
 * this write silently won't persist in production until this is wired back
 * up to Vercel Blob (removed for now -- @vercel/blob broke Vercel deploys
 * for this project in a way we couldn't get logs for; revisit once that's
 * diagnosed). Until then, production photo uploads should keep using the
 * "paste a path under public/assets/faculty/" fallback the admin form
 * already documents.
 */
export async function uploadPhoto(file: FormDataEntryValue | null, dir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(`사진 파일이 너무 큽니다 (최대 ${MAX_PHOTO_BYTES / 1024 / 1024}MB).`);
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;

  const targetDir = path.join(process.cwd(), "public", dir);
  fs.mkdirSync(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(targetDir, filename), buffer);
  return `/${dir}/${filename}`;
}
