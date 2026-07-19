export interface FacultyMember {
  name: string;
  position: string;
  field: string | null;
  email: string | null;
  phone: string | null;
  office: string | null;
  labName: string | null;
  labUrl: string | null;
  photoPath: string | null;
  labSlug: string | null;
  slug: string;
}

export const FIELD_EN: Record<string, string> = {
  "역학·소재": "Mechanics & Materials",
  "에너지·열유체": "Energy & Thermofluids",
  "로보틱스·제어": "Robotics & Control",
  "설계·제조": "Design & Manufacturing",
  "마이크로·나노": "Micro & Nano",
  "바이오·포토닉스": "Bio & Photonics",
};

export function fieldLabel(field: string | null, lang: "ko" | "en"): string {
  if (!field) return "";
  return lang === "en" ? FIELD_EN[field] ?? field : field;
}

const POSITION_EN: Record<string, string> = {
  교수: "Professor",
  부교수: "Associate Professor",
  조교수: "Assistant Professor",
};

export function positionLabel(position: string, lang: "ko" | "en"): string {
  return lang === "en" ? POSITION_EN[position] ?? position : position;
}
