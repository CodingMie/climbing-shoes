import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteReviewAction } from "@/app/reviews/actions";
import { FootSummaryLine } from "@/components/reviews/foot-summary";
import { Button } from "@/components/ui/button";
import { RATING_DIMENSIONS } from "@/db/schema";
import { parsePositiveInt } from "@/lib/params";
import { getReviewDetail } from "@/lib/reviews";
import { RATING_LABELS, formatSizeDelta } from "@/lib/reviews-schema";
import { getSession } from "@/lib/session";
import { formatShoeTitle } from "@/lib/shoes";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const reviewId = parsePositiveInt(id);
  if (!reviewId) return { title: "测评不存在" };
  const review = getReviewDetail(reviewId);
  if (!review) return { title: "测评不存在" };
  return {
    title: `${review.brandName} ${review.shoeModel} 的测评`,
  };
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const reviewId = parsePositiveInt(id);
  if (!reviewId) notFound();
  const review = getReviewDetail(reviewId);
  if (!review) notFound();

  const session = await getSession();
  const isAuthor = session?.user.id === review.userId;
  const shoeTitle = formatShoeTitle({
    brandName: review.brandName,
    model: review.shoeModel,
    variant: review.shoeVariant,
  });
  const authorName = review.authorUsername ?? review.authorName;
  const createdAt = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(review.createdAt);

  const fitFeedback = [
    { label: "脚跟", value: review.heelFit },
    { label: "脚趾", value: review.toeFit },
    { label: "脚背", value: review.instepFit },
    { label: "前掌", value: review.forefootFit },
    { label: "足弓", value: review.archFit },
    { label: "透气", value: review.breathability },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link
        href={`/shoes/${review.shoeId}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 返回鞋款详情
      </Link>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{shoeTitle}</p>
        <h1 className="mt-1 text-2xl font-bold">
          {authorName} 的测评
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          发布于 {createdAt}
        </p>
      </div>

      {isAuthor ? (
        <div className="mt-4 flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`/reviews/${review.id}/edit`}>编辑测评</Link>
          </Button>
          <form action={deleteReviewAction}>
            <input type="hidden" name="reviewId" value={review.id} />
            <Button type="submit" variant="destructive" size="sm">
              删除测评
            </Button>
          </form>
        </div>
      ) : null}

      <section className="mt-8 space-y-2">
        <h2 className="text-base font-semibold">尺码信息</h2>
        <dl className="divide-y rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted-foreground">试穿尺码</dt>
            <dd className="font-medium">
              {review.sizeTried} {review.sizeSystem}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted-foreground">相对日常码</dt>
            <dd className="font-medium">{formatSizeDelta(review.sizeDelta)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-base font-semibold">维度评分</h2>
        <dl className="divide-y rounded-xl border bg-card">
          {RATING_DIMENSIONS.map((dimension) => (
            <div
              key={dimension}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <dt className="text-muted-foreground">{RATING_LABELS[dimension]}</dt>
              <dd className="font-medium">{review[dimension]} 分</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-base font-semibold">合身度反馈</h2>
        <dl className="divide-y rounded-xl border bg-card">
          {fitFeedback.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-base font-semibold">使用背景</h2>
        <dl className="divide-y rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted-foreground">使用场景</dt>
            <dd className="text-right font-medium">
              {review.scenariosUsed.join("、")}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted-foreground">使用时长</dt>
            <dd className="font-medium">{review.duration}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-base font-semibold">文字体验</h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
        {review.pros ? (
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold">优点</h3>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
              {review.pros}
            </p>
          </div>
        ) : null}
        {review.cons ? (
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold">缺点</h3>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
              {review.cons}
            </p>
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold">作者脚型摘要</h2>
        <p className="mt-1 text-sm text-muted-foreground">{authorName}</p>
        <div className="mt-1">
          <FootSummaryLine profile={review} />
        </div>
        {review.footLength ? (
          <p className="mt-1 text-xs text-muted-foreground">
            脚长 {review.footLength} 毫米 · 日常鞋码 EU {review.streetSize}
            {review.footShape ? ` · 脚型 ${review.footShape}` : ""}
          </p>
        ) : null}
      </section>
    </main>
  );
}
