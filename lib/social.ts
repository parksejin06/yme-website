export interface InstagramPost {
  image: string;
  type: "reel" | "post";
  captionKr: string | null;
  captionEn: string | null;
  dateLabel: string;
  permalink: string;
}

export interface InstagramAccount {
  handle: string;
  url: string;
  labelKr: string;
  labelEn: string;
  nameKr: string;
  nameEn: string;
  descriptionKr: string;
  descriptionEn: string;
  posts: InstagramPost[];
}

export interface YouTubeVideo {
  videoId: string;
  titleKr: string;
  titleEn: string;
  dateLabel: string;
  thumbnail: string;
}

export interface YouTubeData {
  channelUrl: string;
  featured: YouTubeVideo;
  recent: YouTubeVideo[];
}
