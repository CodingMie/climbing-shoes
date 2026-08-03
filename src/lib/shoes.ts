import { and, asc, eq, gte, like, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import {
  brand,
  shoe,
  SHOE_LEVELS,
  SHOE_SCENARIOS,
  SHOE_STIFFNESS,
  SHOE_WIDTHS,
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
  q?: string;
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
    q: typeof params.q === "string" ? params.q.trim() || undefined : undefined,
  };
}

export function listBrands() {
  return getDb()
    .select()
    .from(brand)
    .orderBy(asc(brand.name))
    .all();
}

export function listShoes(filters: ShoeFilters = {}) {
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
  if (filters.q) {
    const pattern = `%${filters.q}%`;
    const search = or(
      like(shoe.model, pattern),
      like(shoe.variant, pattern),
      like(brand.name, pattern),
    );
    if (search) conditions.push(search);
  }
  return getDb()
    .select({
      id: shoe.id,
      model: shoe.model,
      variant: shoe.variant,
      price: shoe.price,
      scenarios: shoe.scenarios,
      stiffness: shoe.stiffness,
      width: shoe.width,
      level: shoe.level,
      images: shoe.images,
      brandId: brand.id,
      brandName: brand.name,
    })
    .from(shoe)
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .where(and(...conditions))
    .orderBy(asc(brand.name), asc(shoe.model))
    .all();
}

export function formatShoeTitle(shoeInfo: {
  brandName: string;
  model: string;
  variant: string | null;
}): string {
  return `${shoeInfo.brandName} ${shoeInfo.model}${
    shoeInfo.variant ? ` ${shoeInfo.variant}` : ""
  }`;
}

export function getShoe(id: number) {
  const row = getDb()
    .select({
      id: shoe.id,
      model: shoe.model,
      variant: shoe.variant,
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
