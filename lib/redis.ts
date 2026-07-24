import { Redis } from "@upstash/redis";

/** Shared Upstash Redis client. Reads `UPSTASH_REDIS_REST_URL`/`_TOKEN` from
 * the environment (auto-provisioned by the Vercel Marketplace integration in
 * production, and pulled into `.env.local` for local dev). */
export const redis = Redis.fromEnv();
