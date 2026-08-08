"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { brand, shoe, type ShoeScenario, type SHOE_STIFFNESS, type SHOE_WIDTHS, type SHOE_LEVELS, type SHOE_DOWNTURNS, type SHOE_CLOSURES } from "@/db/schema";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type AdminActionResult = { ok: boolean; error?: string };

export type UpdateShoeData = {
  brandId: number;
  model: string;
  price: number;
  scenarios: ShoeScenario[];
  stiffness: (typeof SHOE_STIFFNESS)[number];
  width: (typeof SHOE_WIDTHS)[number];
  level: (typeof SHOE_LEVELS)[number];
  downturn: (typeof SHOE_DOWNTURNS)[number];
  closure: (typeof SHOE_CLOSURES)[number];
  material: string;
  images: string[];
};

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("无管理员权限");
  }
  return session;
}

export async function deleteShoeAction(shoeId: number): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const db = getDb();
    db.delete(shoe).where(eq(shoe.id, shoeId)).run();
    revalidatePath("/admin/shoes");
    revalidatePath("/shoes");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "删除失败" };
  }
}

export async function deleteBrandAction(brandId: number): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const db = getDb();
    const shoeCount = db.select({ count: shoe.id }).from(shoe).where(eq(shoe.brandId, brandId)).get();
    if (shoeCount && shoeCount.count > 0) {
      return { ok: false, error: "该品牌下还有鞋款，无法删除" };
    }
    db.delete(brand).where(eq(brand.id, brandId)).run();
    revalidatePath("/admin/shoes");
    revalidatePath("/admin/brands");
    revalidatePath("/shoes");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "删除失败" };
  }
}

export async function updateShoeStatusAction(
  shoeId: number,
  status: "approved" | "rejected" | "pending"
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const db = getDb();
    db.update(shoe).set({ status, updatedAt: new Date() }).where(eq(shoe.id, shoeId)).run();
    revalidatePath("/admin/shoes");
    revalidatePath("/shoes");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "更新失败" };
  }
}

export async function updateBrandDescriptionAction(
  brandId: number,
  description: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const db = getDb();
    db.update(brand).set({ description }).where(eq(brand.id, brandId)).run();
    revalidatePath("/admin/brands");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "更新失败" };
  }
}

export async function updateShoeAction(
  shoeId: number,
  data: UpdateShoeData
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
    const db = getDb();
    db.update(shoe).set({
      brandId: data.brandId,
      model: data.model,
      price: data.price,
      scenarios: data.scenarios,
      stiffness: data.stiffness,
      width: data.width,
      level: data.level,
      downturn: data.downturn,
      closure: data.closure,
      material: data.material,
      images: data.images,
      updatedAt: new Date(),
    }).where(eq(shoe.id, shoeId)).run();
    revalidatePath("/admin/shoes");
    revalidatePath(`/admin/shoes/${shoeId}/edit`);
    revalidatePath("/shoes");
    revalidatePath(`/shoes/${shoeId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "更新失败" };
  }
}
