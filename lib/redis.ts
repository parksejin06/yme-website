import { Redis } from "@upstash/redis";

/** Shared Upstash Redis client. Reads `UPSTASH_REDIS_REST_URL`/`_TOKEN` from
 * the environment (auto-provisioned by the Vercel Marketplace integration in
 * production, and pulled into `.env.local` for local dev). */
export const redis = Redis.fromEnv();

/** Reads `key`, falling back to `seed()` both when the key doesn't exist yet
 * (redis.get resolves null) and when Redis itself is unreachable/unconfigured
 * (redis.get rejects -- e.g. no UPSTASH_REDIS_REST_URL/_TOKEN in .env.local).
 * Without this, a local dev environment with no Redis configured gets a 500
 * on every page instead of the seed-file fallback the project's setup docs
 * promise. */
export async function getWithFallback<T>(key: string, seed: () => T): Promise<T> {
  try {
    const stored = await redis.get<T>(key);
    return stored ?? seed();
  } catch (err) {
    console.warn(`[redis] falling back to seed data for "${key}":`, err);
    return seed();
  }
}
