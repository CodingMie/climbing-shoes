import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  ARCH_FITS,
  brand,
  BREATHABILITIES,
  FOREFOOT_FITS,
  footProfile,
  HEEL_FITS,
  INSTEP_FITS,
  RATING_DIMENSIONS,
  review,
  shoe,
  TOE_FITS,
  user,
  type FootShape,
  type FootWidth,
  type HeelWidth,
  type RatingDimension,
} from "@/db/schema";
import { formatSizeDelta, RATING_LABELS, type ReviewInput } from "./reviews-schema";

export type Review = typeof review.$inferSelect;

const authorColumns = {
  authorName: user.name,
  authorUsername: user.username,
};

const footSummaryColumns = {
  footLength: footProfile.footLength,
  footWidth: footProfile.footWidth,
  footShape: footProfile.footShape,
  arch: footProfile.arch,
  instep: footProfile.instep,
  heel: footProfile.heel,
  bunion: footProfile.bunion,
  streetSize: footProfile.streetSize,
};

export function getReviewByUserAndShoe(userId: string, shoeId: number) {
  return (
    getDb()
      .select()
      .from(review)
      .where(and(eq(review.userId, userId), eq(review.shoeId, shoeId)))
      .get() ?? null
  );
}

export function hasUserReviewedShoe(userId: string, shoeId: number): boolean {
  const row = getDb()
    .select({ id: review.id })
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.shoeId, shoeId)))
    .get();
  return !!row;
}

export function listShoeReviews(shoeId: number) {
  return getDb()
    .select({
      id: review.id,
      sizeTried: review.sizeTried,
      sizeSystem: review.sizeSystem,
      sizeDelta: review.sizeDelta,
      overall: review.overall,
      content: review.content,
      createdAt: review.createdAt,
      ...authorColumns,
      ...footSummaryColumns,
    })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .leftJoin(footProfile, eq(review.userId, footProfile.userId))
    .where(eq(review.shoeId, shoeId))
    .orderBy(desc(review.createdAt))
    .all();
}

export type ShoeReviewCard = ReturnType<typeof listShoeReviews>[number];

const shoeColumns = {
  shoeId: shoe.id,
  shoeModel: shoe.model,
  brandName: brand.name,
};

const reviewCardColumns = {
  id: review.id,
  overall: review.overall,
  sizeTried: review.sizeTried,
  sizeSystem: review.sizeSystem,
  sizeDelta: review.sizeDelta,
  content: review.content,
  createdAt: review.createdAt,
};

export function listLatestReviews(limit: number) {
  return getDb()
    .select({
      ...reviewCardColumns,
      ...shoeColumns,
      ...authorColumns,
      ...footSummaryColumns,
    })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .leftJoin(footProfile, eq(review.userId, footProfile.userId))
    .innerJoin(shoe, eq(review.shoeId, shoe.id))
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .where(eq(shoe.status, "approved"))
    .orderBy(desc(review.createdAt))
    .limit(limit)
    .all();
}

export type LatestReviewCard = ReturnType<typeof listLatestReviews>[number];

export function listUserReviews(userId: string) {
  return getDb()
    .select({
      ...reviewCardColumns,
      ...shoeColumns,
      ...footSummaryColumns,
    })
    .from(review)
    .innerJoin(shoe, eq(review.shoeId, shoe.id))
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .leftJoin(footProfile, eq(review.userId, footProfile.userId))
    .where(and(eq(review.userId, userId), eq(shoe.status, "approved")))
    .orderBy(desc(review.createdAt))
    .all();
}

export type UserReviewCard = ReturnType<typeof listUserReviews>[number];

export function getReviewDetail(id: number) {
  const row = getDb()
    .select({
      id: review.id,
      userId: review.userId,
      shoeId: review.shoeId,
      sizeTried: review.sizeTried,
      sizeSystem: review.sizeSystem,
      sizeDelta: review.sizeDelta,
      wrap: review.wrap,
      comfort: review.comfort,
      precision: review.precision,
      sensitivity: review.sensitivity,
      friction: review.friction,
      support: review.support,
      overall: review.overall,
      heelFit: review.heelFit,
      toeFit: review.toeFit,
      instepFit: review.instepFit,
      forefootFit: review.forefootFit,
      archFit: review.archFit,
      breathability: review.breathability,
      scenariosUsed: review.scenariosUsed,
      duration: review.duration,
      content: review.content,
      pros: review.pros,
      cons: review.cons,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      ...authorColumns,
      ...footSummaryColumns,
      shoeModel: shoe.model,
      brandName: brand.name,
    })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .leftJoin(footProfile, eq(review.userId, footProfile.userId))
    .innerJoin(shoe, eq(review.shoeId, shoe.id))
    .innerJoin(brand, eq(shoe.brandId, brand.id))
    .where(eq(review.id, id))
    .get();
  return row ?? null;
}

export type ReviewDetail = NonNullable<ReturnType<typeof getReviewDetail>>;

export function createReview(
  userId: string,
  shoeId: number,
  input: ReviewInput,
): number {
  const row = getDb()
    .insert(review)
    .values({
      userId,
      shoeId,
      ...reviewValues(input),
    })
    .returning({ id: review.id })
    .get();
  return row.id;
}

export function updateReview(id: number, input: ReviewInput): void {
  getDb()
    .update(review)
    .set({ ...reviewValues(input), updatedAt: new Date() })
    .where(eq(review.id, id))
    .run();
}

export function deleteReview(id: number): void {
  getDb().delete(review).where(eq(review.id, id)).run();
}

export type FootFilters = {
  footShape?: FootShape;
  footWidth?: FootWidth;
  footHeel?: HeelWidth;
};

export type ShoeReviewStats = {
  reviewCount: number;
  dimensions: { key: RatingDimension; label: string; avg: number }[];
  sizeDeltas: { delta: number; count: number; percent: number }[];
  sizeHeadline: string | null;
  fits: {
    key: string;
    label: string;
    options: { value: string; count: number; percent: number }[];
  }[];
};

const FIT_DIMENSIONS = [
  { key: "heelFit", label: "脚跟", options: HEEL_FITS },
  { key: "toeFit", label: "脚趾", options: TOE_FITS },
  { key: "instepFit", label: "脚背", options: INSTEP_FITS },
  { key: "forefootFit", label: "前掌", options: FOREFOOT_FITS },
  { key: "archFit", label: "足弓", options: ARCH_FITS },
  { key: "breathability", label: "透气", options: BREATHABILITIES },
] as const;

export function getShoeReviewStats(
  shoeId: number,
  foot: FootFilters = {},
): ShoeReviewStats | null {
  const rows = getDb()
    .select({
      wrap: review.wrap,
      comfort: review.comfort,
      precision: review.precision,
      sensitivity: review.sensitivity,
      friction: review.friction,
      support: review.support,
      overall: review.overall,
      sizeDelta: review.sizeDelta,
      heelFit: review.heelFit,
      toeFit: review.toeFit,
      instepFit: review.instepFit,
      forefootFit: review.forefootFit,
      archFit: review.archFit,
      breathability: review.breathability,
      footShape: footProfile.footShape,
      footWidth: footProfile.footWidth,
      heel: footProfile.heel,
    })
    .from(review)
    .leftJoin(footProfile, eq(review.userId, footProfile.userId))
    .where(eq(review.shoeId, shoeId))
    .all()
    .filter(
      (row) =>
        (!foot.footShape || row.footShape === foot.footShape) &&
        (!foot.footWidth || row.footWidth === foot.footWidth) &&
        (!foot.footHeel || row.heel === foot.footHeel),
    );

  if (rows.length === 0) return null;

  const reviewCount = rows.length;
  const percent = (count: number) => Math.round((count / reviewCount) * 100);

  const dimensions = RATING_DIMENSIONS.map((key) => ({
    key,
    label: RATING_LABELS[key],
    avg:
      Math.round(
        (rows.reduce((sum, row) => sum + row[key], 0) / reviewCount) * 10,
      ) / 10,
  }));

  const deltaCounts = new Map<number, number>();
  for (const row of rows) {
    deltaCounts.set(row.sizeDelta, (deltaCounts.get(row.sizeDelta) ?? 0) + 1);
  }
  const sizeDeltas = [...deltaCounts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([delta, count]) => ({ delta, count, percent: percent(count) }));
  const topDelta = sizeDeltas.reduce((best, item) =>
    item.count > best.count ? item : best,
  );
  const sizeHeadline = `${topDelta.percent}% 用户选择${formatSizeDelta(topDelta.delta)}`;

  const fits = FIT_DIMENSIONS.map(({ key, label, options }) => {
    const counts = new Map<string, number>();
    for (const row of rows) {
      const value = row[key];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return {
      key,
      label,
      options: options
        .map((value) => {
          const count = counts.get(value) ?? 0;
          return { value, count, percent: percent(count) };
        })
        .filter((option) => option.count > 0),
    };
  });

  return { reviewCount, dimensions, sizeDeltas, sizeHeadline, fits };
}

function reviewValues(input: ReviewInput) {
  return {
    sizeTried: input.sizeTried,
    sizeSystem: input.sizeSystem,
    sizeDelta: input.sizeDelta,
    wrap: input.wrap,
    comfort: input.comfort,
    precision: input.precision,
    sensitivity: input.sensitivity,
    friction: input.friction,
    support: input.support,
    overall: input.overall,
    heelFit: input.heelFit,
    toeFit: input.toeFit,
    instepFit: input.instepFit,
    forefootFit: input.forefootFit,
    archFit: input.archFit,
    breathability: input.breathability,
    scenariosUsed: input.scenariosUsed,
    duration: input.duration,
    content: input.content,
    pros: input.pros || null,
    cons: input.cons || null,
  };
}
