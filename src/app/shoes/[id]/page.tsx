import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewCard } from "@/components/reviews/review-card";
import {
  FilterActions,
  FilterSelect,
} from "@/components/shoes/filter-select";
import { Button } from "@/components/ui/button";
import { FOOT_SHAPES, FOOT_WIDTHS, HEEL_WIDTHS } from "@/db/schema";
import { formatSizeDelta } from "@/lib/reviews-schema";
import {
  getReviewByUserAndShoe,
  getShoeReviewStats,
  listShoeReviews,
} from "@/lib/reviews";
import { getSession } from "@/lib/session";
import { getShoe, parseShoeFilters } from "@/lib/shoes";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const shoe = await findShoe(params);
  if (!shoe) return { title: "鞋款不存在" };
  return {
    title: `${shoe.brandName} ${shoe.model}`,
  };
}

async function findShoe(params: Promise<RouteParams>) {
  const { id } = await params;
  const shoeId = Number(id);
  if (!Number.isInteger(shoeId)) return null;
  return getShoe(shoeId);
}

export default async function ShoeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const shoe = await findShoe(params);
  if (!shoe) notFound();

  const session = await getSession();
  const reviews = listShoeReviews(shoe.id);
  const myReview = session
    ? getReviewByUserAndShoe(session.user.id, shoe.id)
    : null;

  const filters = parseShoeFilters(await searchParams);
  const footFilters = {
    footShape: filters.footShape,
    footWidth: filters.footWidth,
    footHeel: filters.footHeel,
  };
  const hasFootFilters =
    footFilters.footShape !== undefined ||
    footFilters.footWidth !== undefined ||
    footFilters.footHeel !== undefined;
  const footDescription = [
    footFilters.footShape,
    footFilters.footWidth,
    footFilters.footHeel,
  ]
    .filter(Boolean)
    .join(" + ");
  const stats = getShoeReviewStats(shoe.id, footFilters);

  const specs: { label: string; value: string }[] = [
    { label: "使用场景", value: shoe.scenarios.join("、") },
    { label: "硬度", value: shoe.stiffness },
    { label: "宽度楦型", value: shoe.width },
    { label: "定位等级", value: shoe.level },
    { label: "下压程度", value: shoe.downturn },
    { label: "闭合方式", value: shoe.closure },
    { label: "鞋面材质", value: shoe.material ?? "—" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/shoes" className="text-sm text-muted-foreground hover:underline">
        ← 返回鞋库
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {shoe.images.length === 0 ? (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
              暂无图片
            </div>
          ) : (
            shoe.images.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${shoe.brandName} ${shoe.model}`}
                className="w-full rounded-xl border object-cover"
              />
            ))
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{shoe.brandName}</p>
          <h1 className="mt-1 text-3xl font-bold">{shoe.model}</h1>
          <p className="mt-3 text-2xl font-semibold">¥{shoe.price}</p>
          {shoe.brandDescription ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {shoe.brandDescription}
            </p>
          ) : null}

          <dl className="mt-6 divide-y rounded-xl border bg-card">
            {specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd className="text-right font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            {myReview ? (
              <Button asChild variant="outline">
                <Link href={`/reviews/${myReview.id}/edit`}>编辑我的测评</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/reviews/new?shoe=${shoe.id}`}>写测评</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">测评数据</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          可按测评者的脚型条件筛选，聚合结果只统计匹配脚型的测评
        </p>

        <form
          method="get"
          className="mt-4 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FilterSelect
            name="footShape"
            label="脚型"
            value={filters.footShape}
            placeholder="全部脚型"
            options={FOOT_SHAPES.map((item) => ({ value: item, label: item }))}
          />
          <FilterSelect
            name="footWidth"
            label="脚宽窄"
            value={filters.footWidth}
            placeholder="全部脚宽窄"
            options={FOOT_WIDTHS.map((item) => ({ value: item, label: item }))}
          />
          <FilterSelect
            name="footHeel"
            label="脚后跟"
            value={filters.footHeel}
            placeholder="全部脚后跟"
            options={HEEL_WIDTHS.map((item) => ({ value: item, label: item }))}
          />
          <FilterActions
            clearHref={`/shoes/${shoe.id}`}
            showClear={hasFootFilters}
          />
        </form>

        {reviews.length === 0 ? (
          <p className="mt-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            还没有测评，聚合数据会在首条测评后出现
          </p>
        ) : stats === null ? (
          <p className="mt-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            没有符合所选脚型的测评，试试调整条件或清空脚型筛选
          </p>
        ) : (
          <div className="mt-6 space-y-8">
            <p className="text-sm text-muted-foreground">
              基于 {stats.reviewCount} 条测评
              {footDescription ? ` · 脚型：${footDescription}` : ""}
            </p>

            <section>
              <h3 className="text-base font-semibold">维度均分</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.dimensions.map((dimension) => (
                  <li
                    key={dimension.key}
                    className="flex items-baseline justify-between gap-2 rounded-lg border bg-card px-3 py-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {dimension.label}
                    </span>
                    <span className="text-lg font-semibold">
                      {dimension.avg.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold">尺码偏移</h3>
              {stats.sizeHeadline ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {stats.sizeHeadline}
                </p>
              ) : null}
              <ul className="mt-3 space-y-2">
                {stats.sizeDeltas.map((bucket) => (
                  <li
                    key={bucket.delta}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-32 shrink-0 text-muted-foreground">
                      {formatSizeDelta(bucket.delta)}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-2 rounded-full bg-primary"
                        style={{ width: `${bucket.percent}%` }}
                      />
                    </span>
                    <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                      {bucket.percent}% · {bucket.count} 条
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <div>
              <h3 className="text-base font-semibold">合身度反馈</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.fits.map((fit) => (
                  <section key={fit.key} className="rounded-xl border bg-card p-4">
                    <h4 className="text-sm font-medium">{fit.label}</h4>
                    <ul className="mt-2 space-y-2">
                      {fit.options.map((option) => (
                        <li
                          key={option.value}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-14 shrink-0 text-muted-foreground">
                            {option.value}
                          </span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <span
                              className="block h-1.5 rounded-full bg-primary"
                              style={{ width: `${option.percent}%` }}
                            />
                          </span>
                          <span className="w-16 shrink-0 text-right text-muted-foreground">
                            {option.percent}% · {option.count} 条
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">测评（{reviews.length}）</h2>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            还没有测评。试穿过后来分享你的体验吧。
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((item) => (
              <ReviewCard key={item.id} review={item} showShoe={false} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
