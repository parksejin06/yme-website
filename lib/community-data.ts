import fs from "node:fs";
import path from "node:path";
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

const DATA_DIR = path.join(process.cwd(), "data", "community");

function boardFilePath(board: BoardKey): string {
  return path.join(DATA_DIR, FILE_NAME[board]);
}

/** Reads a board's JSON file fresh off disk on every call (not cached at the module
 * level) so that admin edits made via the filesystem show up without a server restart. */
function loadBoard(board: BoardKey): CommunityPost[] {
  return JSON.parse(fs.readFileSync(boardFilePath(board), "utf-8"));
}

export function writeBoardData(board: BoardKey, posts: CommunityPost[]): void {
  fs.writeFileSync(boardFilePath(board), JSON.stringify(posts, null, 2) + "\n", "utf-8");
}

// Proxy so existing call sites (`BOARD_DATA[key]`, `Object.keys(BOARD_DATA)`) keep
// working unchanged while every property access re-reads the file from disk.
export const BOARD_DATA: Record<BoardKey, CommunityPost[]> = new Proxy(
  {} as Record<BoardKey, CommunityPost[]>,
  {
    get(_target, prop) {
      if (typeof prop !== "string" || !(prop in FILE_NAME)) return undefined;
      return loadBoard(prop as BoardKey);
    },
    has(_target, prop) {
      return typeof prop === "string" && prop in FILE_NAME;
    },
    ownKeys() {
      return Object.keys(FILE_NAME);
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== "string" || !(prop in FILE_NAME)) return undefined;
      return { enumerable: true, configurable: true, value: loadBoard(prop as BoardKey) };
    },
  }
);

export function getPost(board: BoardKey, id: string): CommunityPost | undefined {
  return loadBoard(board).find((p) => p.sourcePostId === id);
}

export function getAdjacent(board: BoardKey, id: string): { prev: CommunityPost | null; next: CommunityPost | null } {
  const list = loadBoard(board);
  const idx = list.findIndex((p) => p.sourcePostId === id);
  if (idx === -1) return { prev: null, next: null };
  return { prev: idx > 0 ? list[idx - 1] : null, next: idx < list.length - 1 ? list[idx + 1] : null };
}

export function allPostsFlat(): { board: BoardKey; post: CommunityPost }[] {
  return (Object.keys(FILE_NAME) as BoardKey[]).flatMap((board) => loadBoard(board).map((post) => ({ board, post })));
}

export function searchAllPosts(query: string): { board: BoardKey; post: CommunityPost }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allPostsFlat().filter(({ post }) => {
    if (post.title.toLowerCase().includes(q)) return true;
    if ((post.author ?? "").toLowerCase().includes(q)) return true;
    if (post.plainText.toLowerCase().includes(q)) return true;
    if (post.attachments.some((a) => a.fileName.toLowerCase().includes(q))) return true;
    return false;
  });
}
