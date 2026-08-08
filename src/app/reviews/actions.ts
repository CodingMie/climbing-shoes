"use server";

import { redirect } from "next/navigation";
import { getFootProfile } from "@/lib/foot-profile";
import {
  createReview,
  deleteReview,
  getReviewDetail,
  updateReview,
} from "@/lib/reviews";
import {
  reviewRawValues,
  reviewSchema,
} from "@/lib/reviews-schema";
import { getSession } from "@/lib/session";
import { getShoe } from "@/lib/shoes";
import { parsePositiveInt } from "@/lib/params";
import { firstIssueMessage } from "@/lib/zod-helpers";

export type ReviewActionResult = { ok: boolean; error?: string };

const NOT_LOGGED_IN: ReviewActionResult = { ok: false, error: "请先登录" };

export async function submitReviewAction(
  formData: FormData,
): Promise<ReviewActionResult> {
  const session = await getSession();
  if (!session) return NOT_LOGGED_IN;

  const shoeId = parsePositiveInt(formData.get("shoeId"));
  if (!shoeId) return { ok: false, error: "鞋款不存在" };
  const shoe = getShoe(shoeId);
  if (!shoe) return { ok: false, error: "鞋款不存在或未上架" };
  if (!getFootProfile(session.user.id)) {
    return { ok: false, error: "请先完善脚型档案，再提交测评" };
  }

  const parsed = reviewSchema.safeParse(reviewRawValues(formData));
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  const reviewId = createReview(session.user.id, shoeId, parsed.data);
  redirect(`/reviews/${reviewId}`);
}

export async function updateReviewAction(
  formData: FormData,
): Promise<ReviewActionResult> {
  const session = await getSession();
  if (!session) return NOT_LOGGED_IN;

  const reviewId = parsePositiveInt(formData.get("reviewId"));
  if (!reviewId) return { ok: false, error: "测评不存在" };
  const existing = getReviewDetail(reviewId);
  if (!existing || existing.userId !== session.user.id) {
    return { ok: false, error: "无权编辑该测评" };
  }

  const parsed = reviewSchema.safeParse(reviewRawValues(formData));
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  updateReview(reviewId, parsed.data);
  redirect(`/reviews/${reviewId}`);
}

export async function deleteReviewAction(
  formData: FormData,
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const reviewId = parsePositiveInt(formData.get("reviewId"));
  if (!reviewId) redirect("/shoes");
  const existing = getReviewDetail(reviewId);
  if (!existing) redirect("/shoes");
  if (existing.userId !== session.user.id) {
    redirect(`/reviews/${reviewId}`);
  }

  deleteReview(reviewId);
  redirect(`/shoes/${existing.shoeId}`);
}
