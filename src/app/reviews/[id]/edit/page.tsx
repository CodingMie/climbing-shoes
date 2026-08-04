import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";
import { parsePositiveInt } from "@/lib/params";
import { getReviewDetail } from "@/lib/reviews";
import { requireUser } from "@/lib/session";
import { formatShoeTitle } from "@/lib/shoes";

export const metadata: Metadata = {
  title: "编辑测评",
};

type RouteParams = { id: string };

export default async function EditReviewPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const reviewId = parsePositiveInt(id);
  if (!reviewId) notFound();
  const review = getReviewDetail(reviewId);
  if (!review || review.userId !== session.user.id) notFound();

  const shoeTitle = formatShoeTitle({
    brandName: review.brandName,
    model: review.shoeModel,
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href={`/reviews/${review.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 返回测评详情
      </Link>
      <h1 className="mt-4 text-2xl font-bold">编辑测评</h1>
      <p className="mt-2 text-sm text-muted-foreground">目标鞋款：{shoeTitle}</p>
      <div className="mt-8">
        <ReviewForm reviewId={review.id} review={review} />
      </div>
    </main>
  );
}
