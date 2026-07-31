// Split out from upload.ts so client components (file-picker previews/validation)
// can import this constant without pulling in upload.ts's node:fs/@vercel/blob
// imports into the client bundle.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
