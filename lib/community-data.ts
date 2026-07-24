import fs from "node:fs";
import path from "node:path";
import { redis } from "./redis";
import type { CommunityPost, BoardKey } from "./community-content";

const FILE_NAME: Record<BoardKey, string> = {
  "notices-undergraduate": "notices-undergraduate.json",
  "notices-graduate": "notices-graduate.json",
  "notices-external": "notices-external.json",
  "notices-scholarship": "notices-scholarship.json",
  news: "news.json",
  "thesis-reviews": "thesis-reviews.json",
  resources: "resources.json",
  jobs: "jobs.json",
  events: "events.json",
  seminars: "seminars.json",
};

export const BOARD_KEYS = Object.keys(FILE_NAME) as BoardKey[];

/** Redis key holding a board's full post array as JSON. Kept as a single
 * blob per board (matching the old one-file-per-board layout) rather than
 * one Redis entry per post, since boards are always read/written whole. */
function redisKey(board: BoardKey): string {
  return `board:${board}`;
}

// Local dev fallback: if Redis has no data yet for a board (e.g. before the
// one-time migration has run), fall back to the checked-in data/community/*.json
// so `next dev` still works out of the box against the original seed data.
const DATA_DIR = path.join(process.cwd(), "data", "community");
function readSeedFile(board: BoardKey): CommunityPost[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, FILE_NAME[board]), "utf-8"));
}

/** Reads a board's posts from Redis (falling back to the seed JSON file if
 * that board hasn't been migrated/written yet). Always fetched fresh — never
 * cached at the module level — so admin edits show up immediately. */
export async function getBoard(board: BoardKey): Promise<CommunityPost[]> {
  const stored = await redis.get<CommunityPost[]>(redisKey(board));
  return stored ?? readSeedFile(board);
}

export async function getAllBoards(): Promise<Record<BoardKey, CommunityPost[]>> {
  const entries = await Promise.all(BOARD_KEYS.map(async (board) => [board, await getBoard(board)] as const));
  return Object.fromEntries(entries) as Record<BoardKey, CommunityPost[]>;
}

export async function writeBoardData(board: BoardKey, posts: CommunityPost[]): Promise<void> {
  await redis.set(redisKey(board), posts);
}

export async function getPost(board: BoardKey, id: string): Promise<CommunityPost | undefined> {
  return (await getBoard(board)).find((p) => p.sourcePostId === id);
}

export async function getAdjacent(
  board: BoardKey,
  id: string
): Promise<{ prev: CommunityPost | null; next: CommunityPost | null }> {
  const list = await getBoard(board);
  const idx = list.findIndex((p) => p.sourcePostId === id);
  if (idx === -1) return { prev: null, next: null };
  return { prev: idx > 0 ? list[idx - 1] : null, next: idx < list.length - 1 ? list[idx + 1] : null };
}

export async function allPostsFlat(): Promise<{ board: BoardKey; post: CommunityPost }[]> {
  const all = await getAllBoards();
  return BOARD_KEYS.flatMap((board) => all[board].map((post) => ({ board, post })));
}

export async function searchAllPosts(query: string): Promise<{ board: BoardKey; post: CommunityPost }[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const posts = await allPostsFlat();
  return posts.filter(({ post }) => {
    if (post.title.toLowerCase().includes(q)) return true;
    if ((post.author ?? "").toLowerCase().includes(q)) return true;
    if (post.plainText.toLowerCase().includes(q)) return true;
    if (post.attachments.some((a) => a.fileName.toLowerCase().includes(q))) return true;
    return false;
  });
}
