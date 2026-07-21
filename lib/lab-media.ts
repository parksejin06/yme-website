export interface LabMediaVideo {
  provider: "youtube" | "drive" | "other";
  videoId: string | null;
  embedUrl: string;
  watchUrl: string;
  thumbnailUrl: string | null;
  localThumbnail?: string;
}

export interface LabMediaItem {
  labId: string;
  professorName: string | null;
  professorNameEn: string | null;
  professorPosition: string | null;
  labNameKo: string | null;
  labWebsite: string | null;
  researchField: string | null;
  mediaType: "video" | "image";
  video: LabMediaVideo | null;
  promoImageUrl: string | null;
  logoUrl: string | null;
  localPromoImage?: string;
  localLogo?: string;
  matchedFacultySlug: string | null;
  sourceUrl: string;
}

export interface LabMediaFile {
  sourceUrl: string;
  apiUrl: string;
  importedAt: string;
  total: number;
  errors: unknown[];
  items: LabMediaItem[];
}
