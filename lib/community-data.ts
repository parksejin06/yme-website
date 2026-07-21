import noticesUndergraduate from "@/data/community/notices-undergraduate.json";
import noticesGraduate from "@/data/community/notices-graduate.json";
import noticesExternal from "@/data/community/notices-external.json";
import noticesScholarship from "@/data/community/notices-scholarship.json";
import news from "@/data/community/news.json";
import thesisReviews from "@/data/community/thesis-reviews.json";
import resources from "@/data/community/resources.json";
import jobs from "@/data/community/jobs.json";
import events from "@/data/community/events.json";
import seminars from "@/data/community/seminars.json";
import type { CommunityPost, BoardKey } from "./community-content";

export const BOARD_DATA: Record<BoardKey, CommunityPost[]> = {
  "notices-undergraduate": noticesUndergraduate as CommunityPost[],
  "notices-graduate": noticesGraduate as CommunityPost[],
  "notices-external": noticesExternal as CommunityPost[],
  "notices-scholarship": noticesScholarship as CommunityPost[],
  news: news as CommunityPost[],
  "thesis-reviews": thesisReviews as CommunityPost[],
  resources: resources as CommunityPost[],
  jobs: jobs as CommunityPost[],
  events: events as CommunityPost[],
  seminars: seminars as CommunityPost[],
};

export function getPost(board: BoardKey, id: string): CommunityPost | undefined {
  return BOARD_DATA[board].find((p) => p.sourcePostId === id);
}

export function getAdjacent(board: BoardKey, id: string): { prev: CommunityPost | null; next: CommunityPost | null } {
  const list = BOARD_DATA[board];
  const idx = list.findIndex((p) => p.sourcePostId === id);
  if (idx === -1) return { prev: null, next: null };
  return { prev: idx > 0 ? list[idx - 1] : null, next: idx < list.length - 1 ? list[idx + 1] : null };
}

export function allPostsFlat(): { board: BoardKey; post: CommunityPost }[] {
  return (Object.keys(BOARD_DATA) as BoardKey[]).flatMap((board) => BOARD_DATA[board].map((post) => ({ board, post })));
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
