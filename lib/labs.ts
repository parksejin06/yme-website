import { FIELD_EN } from "@/lib/faculty";
import type { Lang } from "@/lib/nav";

export interface LabEntry {
  field: string;
  name: string;
  position: string;
  email: string | null;
  phone: string | null;
  office: string | null;
  labNameEn: string | null;
  labUrl: string | null;
  researchTitles: string[];
  researchMediaUrl: string | null;
  photoPath: string | null;
  slug: string;
}

export interface ResearchField {
  key: string;
  image: string;
}

// Same order used elsewhere on the site (faculty page hero description, etc.)
export const RESEARCH_FIELDS: ResearchField[] = [
  { key: "역학·소재", image: "/images/lab_main_images/역학_소재_new.jpg" },
  { key: "에너지·열유체", image: "/images/lab_main_images/energy-thermofluids.jpg" },
  { key: "로보틱스·제어", image: "/images/lab_main_images/로보틱스_제어_new.jpg" },
  { key: "설계·제조", image: "/images/lab_main_images/design-manufacturing.jpg" },
  { key: "마이크로·나노", image: "/images/lab_main_images/micro-nano.jpg" },
  { key: "바이오·포토닉스", image: "/images/lab_main_images/bio-photonics.jpg" },
];

export function fieldLabel(field: string, lang: Lang): string {
  return lang === "en" ? FIELD_EN[field] ?? field : field;
}

export function groupLabsByField(labs: LabEntry[]): Record<string, LabEntry[]> {
  const groups: Record<string, LabEntry[]> = {};
  for (const field of RESEARCH_FIELDS) groups[field.key] = [];
  for (const lab of labs) {
    if (!groups[lab.field]) groups[lab.field] = [];
    groups[lab.field].push(lab);
  }
  return groups;
}
