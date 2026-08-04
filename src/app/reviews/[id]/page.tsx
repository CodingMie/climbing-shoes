import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteReviewAction } from "@/app/reviews/actions";
import { FootSummaryLine, FootStatsLine } from "@/components/reviews/foot-summary";
import { RadarChart } from "@/components/shoes/radar-chart";
import { Button } from "@/components/ui/button";
import { RATING_DIMENSIONS } from "@/db/schema";
import { parsePositiveInt } from "@/lib/params";
import { getReviewDetail } from "@/lib/reviews";
import { RATING_LABELS, formatSizeDelta } from "@/lib/reviews-schema";
import { getSession } from "@/lib/session";

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

function KvList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="overflow-hidden rounded-lg border border-border bg-card">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex justify-between gap-4 border-t border-border px-4 py-[11px] text-[13px] first:border-t-0"
        >
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
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
  const authorName = review.authorUsername ?? review.authorName;
  const createdAt = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(review.createdAt);

  const radarDimensions = RATING_DIMENSIONS.filter(
    (dimension) => dimension !== "overall",
  ).map((dimension) => ({
    label: RATING_LABELS[dimension],
    avg: review[dimension],
  }));

  const fitFeedback = [
    { label: "脚跟", value: review.heelFit },
    { label: "脚趾", value: review.toeFit },
    { label: "脚背", value: review.instepFit },
    { label: "前掌", value: review.forefootFit },
    { label: "足弓", value: review.archFit },
    { label: "透气", value: review.breathability },
  ];

  const prosCons = [
    { title: "优点", text: review.pros },
    { title: "缺点", text: review.cons },
  ].filter((item) => item.text !== null);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link
        href={`/shoes/${review.shoeId}`}
        className="text-label text-muted-foreground transition-colors hover:text-trail"
      >
        ← 返回鞋款详情
      </Link>

      <div className="mt-4">
        <p className="micro-label">
          {review.brandName} · {review.shoeModel}
        </p>
        <h1 className="mt-1 text-[26px] font-black tracking-[-0.01em]">
          {review.authorUsername ? (
            <Link
              href={`/u/${review.authorUsername}`}
              className="underline underline-offset-4"
            >
              {authorName}
            </Link>
          ) : (
            authorName
          )}{" "}
          的测评
        </h1>
        <p className="mt-1.5 font-mono text-[11.5px] text-muted-foreground">
          发布于 {createdAt}
        </p>
      </div>

      {isAuthor ? (
        <div className="mt-4 flex items-center gap-2.5">
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

      <section className="mt-8">
        <h3 className="mb-3 text-[15px] font-bold">尺码信息</h3>
        <div className="flex flex-wrap items-center gap-3.5 rounded-lg border border-border bg-card px-3.5 py-2.5 font-mono text-[12.5px]">
          <span>
            <span className="block text-[10.5px] tracking-[0.14em] text-muted-foreground">
              日常码 · STREET
            </span>
            <b className="text-sm font-semibold">
              {review.streetSize ? `EU ${review.streetSize}` : "—"}
            </b>
          </span>
          <span aria-hidden className="text-hairline-strong">
            →
          </span>
          <span>
            <span className="block text-[10.5px] tracking-[0.14em] text-muted-foreground">
              试穿 · TRIED
            </span>
            <b className="text-sm font-semibold">
              {review.sizeSystem} {review.sizeTried}
            </b>
          </span>
          <span className="ml-auto inline-flex h-5 items-center rounded-(--radius) border border-primary/25 bg-trail-tint px-2 text-[11px] font-semibold text-primary">
            {formatSizeDelta(review.sizeDelta)}
          </span>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-[15px] font-bold">维度评分</h3>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-hairline">
          <section className="bg-card px-5 py-[18px]">
            <ul className="sr-only">
              <li>
                {RATING_LABELS.overall} {review.overall} 分
              </li>
              {radarDimensions.map((dimension) => (
                <li key={dimension.label}>
                  {dimension.label} {dimension.avg} 分
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between gap-2.5">
              <span className="micro-label">综合推荐指数 · OVERALL</span>
              <span className="font-mono text-2xl font-semibold">
                {review.overall}
                <span className="text-[11.5px] font-normal text-muted-foreground">
                  {" "}
                  / 5
                </span>
              </span>
            </div>
            <RadarChart
              dimensions={radarDimensions}
              ariaLabel="六维度评分雷达图"
              formatValue={(value) => `${value}`}
              className="max-w-[280px]"
            />
          </section>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-[15px] font-bold">合身度反馈</h3>
        <KvList items={fitFeedback} />
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-[15px] font-bold">使用背景</h3>
        <KvList
          items={[
            { label: "使用场景", value: review.scenariosUsed.join("、") },
            { label: "使用时长", value: review.duration },
          ]}
        />
      </section>

      <section className="mt-8">
        <h3 className="mb-2.5 text-[15px] font-bold">文字体验</h3>
        <p className="text-[13.5px] leading-[1.9] whitespace-pre-wrap text-ink-soft">
          {review.content}
        </p>
        {prosCons.length > 0 ? (
          <div
            className={
              prosCons.length === 2
                ? "mt-4 grid grid-cols-2 gap-3.5"
                : "mt-4"
            }
          >
            {prosCons.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card px-4 py-3.5"
              >
                <h4 className="text-[13px] font-bold">{item.title}</h4>
                <p className="mt-1.5 text-[12.5px] leading-[1.8] whitespace-pre-wrap text-ink-soft">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card px-[18px] py-4">
        <h3 className="text-[13px] font-bold">作者脚型摘要</h3>
        <p className="mt-1.5 text-[13px] font-medium">{authorName}</p>
        <div className="mt-0.5">
          <FootSummaryLine profile={review} />
        </div>
        <div className="mt-0.5">
          <FootStatsLine profile={review} />
        </div>
      </section>
    </main>
  );
}
