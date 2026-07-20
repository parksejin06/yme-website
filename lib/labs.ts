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

export const FIELD_DESCRIPTIONS: Record<string, { ko: string; en: string }> = {
  "역학·소재": {
    ko: "재료의 강도, 변형, 마모, 나노/마이크로 스케일 물리 거동을 해석하고 새로운 소재를 설계하는 분야입니다. 시뮬레이션과 실험을 아울러 항공우주, 의료기기, 에너지 소재 등 다양한 산업에 적용됩니다.",
    en: "Analyzes the strength, deformation, wear, and nano/micro-scale physical behavior of materials to design new ones. Combining simulation and experiment, findings apply across aerospace, medical devices, and energy materials.",
  },
  "에너지·열유체": {
    ko: "열전달, 유체역학, 연료전지, 배터리 등 에너지 변환과 관리 기술을 연구합니다. 열유체 현상의 근본 원리를 규명해 친환경·지속가능한 에너지 시스템을 개발합니다.",
    en: "Studies heat transfer, fluid dynamics, fuel cells, and batteries for energy conversion and management. Uncovers the fundamental principles of thermal-fluid phenomena to develop eco-friendly, sustainable energy systems.",
  },
  "로보틱스·제어": {
    ko: "로봇 메커니즘 설계부터 자율주행, 인간-로봇 상호작용까지 지능형 시스템의 구조와 제어 이론을 연구합니다. AI 기반 학습 제어 기술로 차세대 로봇을 선도합니다.",
    en: "Covers robot mechanism design, autonomous driving, and human-robot interaction through the structure and control theory of intelligent systems. Leads next-generation robotics with AI-based learning control.",
  },
  "설계·제조": {
    ko: "차세대 공작기계, 스마트 팩토리, 정밀 가공 기술을 연구하며 제조 시스템의 자동화와 지능화를 추구합니다. 구조 최적화 설계로 더 가볍고 효율적인 제품을 만듭니다.",
    en: "Researches next-generation machine tools, smart factories, and precision machining to automate and modernize manufacturing systems. Uses structural optimization to create lighter, more efficient products.",
  },
  "마이크로·나노": {
    ko: "MEMS/NEMS, 나노소재, 반도체 공정 기술을 기반으로 초소형 센서와 소자를 개발합니다. 환경 모니터링부터 바이오센서까지 폭넓게 응용됩니다.",
    en: "Develops ultra-compact sensors and devices based on MEMS/NEMS, nanomaterials, and semiconductor processing. Applications range from environmental monitoring to biosensors.",
  },
  "바이오·포토닉스": {
    ko: "광학, 이미징, 바이오메디컬 공학을 융합해 질병 진단, 3D 프린팅, 광학 센싱 기술을 연구합니다. 의료와 광학의 경계를 넘나드는 혁신 기술을 만듭니다.",
    en: "Fuses optics, imaging, and biomedical engineering to research disease diagnostics, 3D printing, and optical sensing. Creates innovative technology at the intersection of medicine and optics.",
  },
};

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
