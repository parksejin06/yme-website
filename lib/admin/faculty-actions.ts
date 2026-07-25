"use server";

import { redirect } from "next/navigation";
import {
  getFaculty,
  writeFaculty,
  getFacultyEmeritus,
  writeFacultyEmeritus,
  generateUniqueSlug,
} from "@/lib/faculty-data";
import { uploadPhoto } from "./upload";
import type { FacultyMember } from "@/lib/faculty";
import type { EmeritusFaculty } from "@/components/EmeritusFacultyGrid";

function str(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}

async function buildFaculty(
  formData: FormData,
  existingPhotoPath: string | null
): Promise<Omit<FacultyMember, "slug" | "labSlug">> {
  const uploaded = await uploadPhoto(formData.get("photo"), "assets/faculty");
  return {
    name: String(formData.get("name") ?? "").trim(),
    position: "교수",
    field: String(formData.get("field") ?? "").trim(),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    office: str(formData, "office"),
    labName: str(formData, "labName"),
    labUrl: str(formData, "labUrl"),
    photoPath: uploaded ?? existingPhotoPath,
  };
}

export async function createFacultyAction(formData: FormData) {
  const list = await getFaculty();
  const built = await buildFaculty(formData, null);
  const slug = generateUniqueSlug(built.name, list.map((f) => f.slug));
  await writeFaculty([...list, { ...built, slug, labSlug: slug }]);
  redirect("/admin/faculty");
}

export async function updateFacultyAction(slug: string, formData: FormData) {
  const list = await getFaculty();
  const idx = list.findIndex((f) => f.slug === slug);
  if (idx === -1) redirect("/admin/faculty");
  const built = await buildFaculty(formData, list[idx].photoPath);
  const next = [...list];
  next[idx] = { ...built, slug, labSlug: slug };
  await writeFaculty(next);
  redirect("/admin/faculty");
}

export async function deleteFacultyAction(slug: string) {
  await writeFaculty((await getFaculty()).filter((f) => f.slug !== slug));
  redirect("/admin/faculty");
}

async function buildEmeritus(
  formData: FormData,
  existingPhotoPath: string | null
): Promise<Omit<EmeritusFaculty, "slug">> {
  const uploaded = await uploadPhoto(formData.get("photo"), "assets/faculty/emeritus");
  return {
    name: String(formData.get("name") ?? "").trim(),
    nameEn: str(formData, "nameEn"),
    field: str(formData, "field"),
    tenure: str(formData, "tenure"),
    email: str(formData, "email"),
    photoPath: uploaded ?? existingPhotoPath,
  };
}

export async function createEmeritusAction(formData: FormData) {
  const list = await getFacultyEmeritus();
  const built = await buildEmeritus(formData, null);
  const slug = generateUniqueSlug(built.name, list.map((f) => f.slug));
  await writeFacultyEmeritus([...list, { ...built, slug }]);
  redirect("/admin/faculty/emeritus");
}

export async function updateEmeritusAction(slug: string, formData: FormData) {
  const list = await getFacultyEmeritus();
  const idx = list.findIndex((f) => f.slug === slug);
  if (idx === -1) redirect("/admin/faculty/emeritus");
  const built = await buildEmeritus(formData, list[idx].photoPath);
  const next = [...list];
  next[idx] = { ...built, slug };
  await writeFacultyEmeritus(next);
  redirect("/admin/faculty/emeritus");
}

export async function deleteEmeritusAction(slug: string) {
  await writeFacultyEmeritus((await getFacultyEmeritus()).filter((f) => f.slug !== slug));
  redirect("/admin/faculty/emeritus");
}
