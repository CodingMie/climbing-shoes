import { and, asc, avg, count, desc, eq, gte, like, lte } from "drizzle-orm";
import { getDb } from "@/db";
import {
  brand,
  FOOT_SHAPES,
  FOOT_WIDTHS,
  footProfile,
  HEEL_WIDTHS,
  review,
  shoe,
  SHOE_LEVELS,
  SHOE_SCENARIOS,
  SHOE_STIFFNESS,
  SHOE_WIDTHS,
  type FootShape,
  type FootWidth,
  type HeelWidth,
  type ShoeScenario,
} from "@/db/schema";

export type ShoeFilters = {
  brandId?: number;
  scenario?: ShoeScenario;
  stiffness?: (typeof SHOE_STIFFNESS)[number];
  width?: (typeof SHOE_WIDTHS)[number];
  level?: (typeof SHOE_LEVELS)[number];
  priceMin?: number;
  priceMax?: number;
  footShape?: FootShape;
  footWidth?: FootWidth;
  footHeel?: HeelWidth;
};

function pick<T extends string>(
  value: string | string[] | undefined,
  options: readonly T[],
): T | undefined {
  if (typeof value !== "string" || !value) return undefined;
  return (options as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

function pickInt(
  value: string | string[] | undefined,
): number | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseShoeFilters(
  params: Record<string, string | string[] | undefined>,
): ShoeFilters {
  return {
    brandId: pickInt(params.brand),
    scenario: pick(params.scenario, SHOE_SCENARIOS),
    stiffness: pick(params.stiffness, SHOE_STIFFNESS),
    width: pick(params.width, SHOE_WIDTHS),
    level: pick(params.level, SHOE_LEVELS),
    priceMin: pickInt(params.priceMin),
    priceMax: pickInt(params.priceMax),
    footShape: pick(params.footShape, FOOT_SHAPES),
    footWidth: pick(params.footWidth, FOOT_WIDTHS),
    footHeel: pick(params.footHeel, HEEL_WIDTHS),
  };
}

export async function listBrands(): Promise<Brand[]> {
  return getDb().select().from(brand).orderBy(asc(brand.name)).all();
}

type Brand = typeof brand.$inferSelect;

const shoeListColumns = {
  id: shoe.id,
  model: shoe.model,
  price: shoe.price,
  scenarios: shoe.scenarios,
  stiffness: shoe.stiffness,
  width: shoe.width,
  level: shoe.level,
  images: shoe.images,
  brandId: brand.id,
  brandName: brand.name,
};

export async function listShoes(filters: ShoeFilters = {}) {
  const conditions = [eq(shoe.status, "approved")];
  if (filters.brandId !== undefined) {
    conditions.push(eq(shoe.brandId, filters.brandId));
  }
  if (filters.scenario) {
    conditions.push(like(shoe.scenarios, `%"${filters.scenario}"%`));
  }
  if (filters.stiffness) conditions.push(eq(shoe.stiffness, filters.stiffness));
  if (filters.width) conditions.push(eq(shoe.width, filters.width));
  if (filters.level) conditions.push(eq(shoe.level, filters.level));
  if (filters.priceMin !== undefined) {
    conditions.push(gte(shoe.price, filters.priceMin));
  }
  if (filters.priceMax !== undefined) {
    conditions.push(lte(shoe.price, filters.priceMax));
  }

  const footConditions = [];
  if (filters.footShape) {
    footConditions.push(eq(footProfile.footShape, filters.footShape));
  }
  if (filters.footWidth) {
    footConditions.push(eq(footProfile.footWidth, filters.footWidth));
  }
  if (filters.footHeel) {
    footConditions.push(eq(footProfile.heel, filters.footHeel));
  }

  if (footConditions.length === 0) {
    const totalReviewCount = count(review.id);
    const rows = await getDb()
      .select({
        ...shoeListColumns,
        totalReviewCount,
      })
      .from(shoe)
      .innerJoin(brand, eq(shoe.brandId, brand.id))
      .leftJoin(review, eq(review.shoeId, shoe.id))
      .where(and(...conditions))
      .groupBy(shoe.id)
      .orderBy(asc(brand.name), asc(shoe.model))
      .all();
    return rows.map((row) => ({
      ...row,
      matchAvgRating: null,
      matchReviewerCount: null,
    }));
  }

  const matchRating = avg(review.overall);
  const matchCount = count(review.id);
  const rows = await getDb()
    .select({
      ...shoeListColumns,
      matchAvgRating: matchRating,
      matchReviewerCount: matchCount,
      totalReviewCount: matchCount,
    })
    .from(shoe)
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .innerJoin(review, eq(review.shoeId, shoe.id))
    .innerJoin(footProfile, eq(review.userId, footProfile.userId))
    .where(and(...conditions, ...footConditions))
    .groupBy(shoe.id)
    .orderBy(desc(matchRating), desc(matchCount), asc(brand.name), asc(shoe.model))
    .all();
  return rows.map((row) => ({
    ...row,
    matchAvgRating:
      row.matchAvgRating === null ? null : Number(row.matchAvgRating),
  }));
}

export type ShoeListItem = Awaited<ReturnType<typeof listShoes>>[number];

export function formatShoeTitle(shoeInfo: {
  brandName: string;
  model: string;
}): string {
  return `${shoeInfo.brandName} ${shoeInfo.model}`;
}

export async function getShoe(id: number) {
  const row = await getDb()
    .select({
      id: shoe.id,
      model: shoe.model,
      price: shoe.price,
      scenarios: shoe.scenarios,
      stiffness: shoe.stiffness,
      width: shoe.width,
      level: shoe.level,
      downturn: shoe.downturn,
      closure: shoe.closure,
      material: shoe.material,
      images: shoe.images,
      brandId: brand.id,
      brandName: brand.name,
      brandDescription: brand.description,
    })
    .from(shoe)
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .where(and(eq(shoe.id, id), eq(shoe.status, "approved")))
    .get();
  return row ?? null;
}
