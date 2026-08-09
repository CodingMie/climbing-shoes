import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewCard } from "@/components/reviews/review-card";
import { RadarChart } from "@/components/shoes/radar-chart";
import {
  FilterActions,
  FilterSelect,
} from "@/components/shoes/filter-select";
import { Button } from "@/components/ui/button";
import { FOOT_SHAPES, FOOT_WIDTHS, HEEL_WIDTHS } from "@/db/schema";
import { formatSizeDelta } from "@/lib/reviews-schema";
import {
  hasUserReviewedShoe,
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
  const reviews = await listShoeReviews(shoe.id);
  const userHasReview = session
    ? await hasUserReviewedShoe(session.user.id, shoe.id)
    : false;

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
  const stats = await getShoeReviewStats(shoe.id, footFilters);
  const radarDimensions = stats
    ? stats.dimensions.filter((dimension) => dimension.key !== "overall")
    : [];
  const overallDimension = stats
    ? stats.dimensions.find((dimension) => dimension.key === "overall")
    : undefined;
  const srDimensions = [
    ...(overallDimension ? [overallDimension] : []),
    ...radarDimensions,
  ];
  const headlineMatch = stats?.sizeHeadline?.match(/^(\d+%)\s*(.*)$/);

  const specs: { label: string; value: string; mono?: boolean }[] = [
    { label: "使用场景", value: shoe.scenarios.join("、") },
    { label: "硬度", value: shoe.stiffness },
    { label: "宽度楦型", value: shoe.width },
    { label: "定位等级", value: shoe.level },
    { label: "下压程度", value: shoe.downturn },
    { label: "闭合方式", value: shoe.closure },
    { label: "鞋面材质", value: shoe.material ?? "—" },
    { label: "参考价", value: `¥${shoe.price}`, mono: true },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-[22px] md:px-7 md:pb-11 md:pt-8">
      <Link
        href="/shoes"
        className="text-label text-muted-foreground transition-colors hover:text-trail"
      >
        ← 返回鞋库
      </Link>

      <div className="mt-[18px] grid gap-8 lg:grid-cols-[5fr_6fr]">
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-surface-2">
          {(() => {
            const primaryImage = shoe.images[0];
            if (primaryImage) {
              return (
                <img
                  src={primaryImage}
                  alt={`${shoe.brandName} ${shoe.model}`}
                  className="h-full w-full object-cover"
                />
              );
            }
            return (
              <>
                <span className="micro-label">IMG · 鞋款主图 800×600</span>
                <span className="micro-label text-[9px]">占位槽 · 交付时换真图</span>
              </>
            );
          })()}
        </div>

        <div>
          <p className="micro-label">{shoe.brandName} · SPEC 规格</p>
          <h1 className="mt-1.5 text-[32px] font-black leading-[1.15] tracking-[-0.015em]">
            {shoe.model}
          </h1>
          <p className="mt-3 font-mono text-[22px] font-semibold">
            ¥{shoe.price}
          </p>
          {shoe.brandDescription ? (
            <p className="mt-2.5 max-w-[52ch] text-[13px] text-muted-foreground">
              {shoe.brandDescription}
            </p>
          ) : null}

          <dl className="mt-[18px] grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-hairline lg:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-card px-4 py-3.5">
                <dt className="micro-label">{spec.label}</dt>
                <dd
                  className={
                    spec.mono
                      ? "mt-[5px] font-mono text-[15px] font-semibold"
                      : "mt-[5px] text-sm font-medium"
                  }
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-[18px] flex gap-2.5">
            <Button asChild>
              <Link href={`/reviews/new?shoe=${shoe.id}`}>
                {userHasReview ? "写另一条测评" : "写测评"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-11">
        <h2 className="text-xl font-bold">测评数据</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          可按测评者的脚型条件筛选，聚合结果只统计匹配脚型的测评
        </p>

        <form
          method="get"
          className="mt-4 grid grid-cols-2 gap-3.5 rounded-lg border border-border bg-card p-[18px] lg:grid-cols-4"
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
          <p className="mt-4 rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
            还没有测评，聚合数据会在首条测评后出现
          </p>
        ) : stats === null ? (
          <p className="mt-4 rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
            没有符合所选脚型的测评，试试调整条件或清空脚型筛选
          </p>
        ) : (
          <>
            <p className="mt-5 font-mono text-xs text-muted-foreground">
              基于 {stats.reviewCount} 条测评
              {footDescription ? ` · 脚型：${footDescription}` : ""}
            </p>

            <div className="mt-3 grid gap-px overflow-hidden rounded-lg border border-border bg-hairline lg:grid-cols-[1.1fr_0.95fr_1.15fr]">
              <section className="bg-card px-5 py-[18px]">
                <h3 className="text-sm font-bold">维度均分</h3>
                <ul className="sr-only">
                  {srDimensions.map((dimension) => (
                    <li key={dimension.key}>
                      {dimension.label} {dimension.avg.toFixed(1)}
                    </li>
                  ))}
                </ul>
                {overallDimension ? (
                  <div className="mt-3 flex items-baseline justify-between gap-2.5">
                    <span className="micro-label">综合推荐指数 · OVERALL</span>
                    <span className="font-mono text-2xl font-semibold">
                      {overallDimension.avg.toFixed(1)}
                      <span className="text-[11.5px] font-normal text-muted-foreground">
                        {" "}
                        / 5
                      </span>
                    </span>
                  </div>
                ) : null}
                <RadarChart dimensions={radarDimensions} />
              </section>

              <section className="bg-card px-5 py-[18px]">
                <h3 className="text-sm font-bold">尺码偏移</h3>
                {headlineMatch ? (
                  <p className="mt-2.5 text-[13px] text-ink-soft">
                    <b className="font-mono font-semibold text-primary">
                      {headlineMatch[1]}
                    </b>{" "}
                    {headlineMatch[2]}
                  </p>
                ) : null}
                <ul className="mt-3.5 grid gap-[9px]">
                  {stats.sizeDeltas.map((bucket) => (
                    <li key={bucket.delta} className="flex items-center gap-2.5">
                      <span className="w-[92px] shrink-0 text-xs text-ink-soft">
                        {formatSizeDelta(bucket.delta)}
                      </span>
                      <span className="h-[3px] flex-1 overflow-hidden rounded-[1px] bg-surface-2">
                        <span
                          className="block h-full rounded-[1px] bg-primary"
                          style={{ width: `${bucket.percent}%` }}
                        />
                      </span>
                      <span className="w-[76px] shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                        {bucket.percent}% · {bucket.count} 条
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="bg-card px-5 py-[18px]">
                <h3 className="text-sm font-bold">合身度反馈</h3>
                <div className="mt-1.5">
                  {stats.fits.map((fit) => {
                    const topPercent = Math.max(
                      ...fit.options.map((option) => option.percent),
                    );
                    return (
                      <section
                        key={fit.key}
                        className="flex items-baseline gap-4 border-t border-border py-[9px] first:border-t-0"
                      >
                        <h4 className="w-[52px] shrink-0 text-[13px] font-bold">
                          {fit.label}
                        </h4>
                        <ul className="flex flex-wrap font-mono text-xs text-muted-foreground">
                          {fit.options.map((option, index) => (
                            <li
                              key={option.value}
                              className={
                                option.percent === topPercent
                                  ? "font-semibold text-primary"
                                  : undefined
                              }
                            >
                              {index > 0 ? (
                                <span
                                  aria-hidden
                                  className="mx-2 text-hairline-strong"
                                >
                                  ·
                                </span>
                              ) : null}
                              {option.value} {option.percent}%
                            </li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="mt-11">
        <h2 className="mb-3.5 text-lg font-bold">测评（{reviews.length}）</h2>

        {reviews.length === 0 ? (
          <p className="rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
            还没有测评。试穿过后来分享你的体验吧。
          </p>
        ) : (
          <ul className="grid gap-3.5">
            {reviews.map((item) => (
              <ReviewCard key={item.id} review={item} showShoe={false} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
