import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { brand, footProfile, review, shoe, user } from "@/db/schema";
import type { ReviewInput } from "./reviews-schema";

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
      shoeVariant: shoe.variant,
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
