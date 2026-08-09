import type { Metadata } from "next";
import Link from "next/link";
import {
  FilterActions,
  FilterSelect,
} from "@/components/shoes/filter-select";
import { Input } from "@/components/ui/input";
import {
  FOOT_SHAPES,
  FOOT_WIDTHS,
  HEEL_WIDTHS,
  SHOE_LEVELS,
  SHOE_SCENARIOS,
  SHOE_STIFFNESS,
  SHOE_WIDTHS,
} from "@/db/schema";
import {
  listBrands,
  listShoes,
  parseShoeFilters,
  type ShoeFilters,
} from "@/lib/shoes";

export const metadata: Metadata = {
  title: "鞋库",
};

function shoeHref(id: number, filters: ShoeFilters): string {
  const params = new URLSearchParams();
  if (filters.footShape) params.set("footShape", filters.footShape);
  if (filters.footWidth) params.set("footWidth", filters.footWidth);
  if (filters.footHeel) params.set("footHeel", filters.footHeel);
  const query = params.toString();
  return query ? `/shoes/${id}?${query}` : `/shoes/${id}`;
}

export default async function ShoesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseShoeFilters(params);
  const brands = await listBrands();
  const shoes = await listShoes(filters);
  const hasFootFilters =
    filters.footShape !== undefined ||
    filters.footWidth !== undefined ||
    filters.footHeel !== undefined;
  const hasActiveFilters =
    filters.brandId !== undefined ||
    filters.scenario !== undefined ||
    filters.stiffness !== undefined ||
    filters.width !== undefined ||
    filters.level !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    hasFootFilters;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-[22px] md:px-7 md:pb-11 md:pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h1 className="text-[26px] font-black tracking-[-0.01em]">鞋库</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            按鞋款属性或测评者脚型筛选
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          共 {shoes.length} 款
          {hasFootFilters ? " · 按匹配脚型测评者的平均分排序" : ""}
        </p>
      </div>

      <form
        method="get"
        className="mt-[18px] grid grid-cols-2 gap-3.5 rounded-lg border border-border bg-card p-[18px] lg:grid-cols-4"
      >
        <FilterSelect
          name="brand"
          label="品牌"
          value={filters.brandId}
          placeholder="全部品牌"
          options={brands.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
        <FilterSelect
          name="scenario"
          label="使用场景"
          value={filters.scenario}
          placeholder="全部场景"
          options={SHOE_SCENARIOS.map((item) => ({ value: item, label: item }))}
        />
        <FilterSelect
          name="stiffness"
          label="硬度"
          value={filters.stiffness}
          placeholder="全部硬度"
          options={SHOE_STIFFNESS.map((item) => ({ value: item, label: item }))}
        />
        <FilterSelect
          name="width"
          label="宽度楦型"
          value={filters.width}
          placeholder="全部楦型"
          options={SHOE_WIDTHS.map((item) => ({ value: item, label: item }))}
        />
        <FilterSelect
          name="level"
          label="定位等级"
          value={filters.level}
          placeholder="全部定位"
          options={SHOE_LEVELS.map((item) => ({ value: item, label: item }))}
        />
        <label className="col-span-2 flex flex-col gap-1.5">
          <span className="text-label font-medium text-ink-soft">
            价格区间（元）
          </span>
          <span className="flex items-center gap-2">
            <Input
              type="number"
              name="priceMin"
              min={0}
              placeholder="最低"
              defaultValue={filters.priceMin ?? ""}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              name="priceMax"
              min={0}
              placeholder="最高"
              defaultValue={filters.priceMax ?? ""}
            />
          </span>
        </label>
        <FilterActions clearHref="/shoes" showClear={hasActiveFilters} />
        <p className="col-span-full mt-1 border-t border-border pt-3.5 text-[13px] font-bold">
          按脚型筛选
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            找出符合脚型的测评者评过的鞋，按他们的平均分排序
          </span>
        </p>
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
      </form>

      {shoes.length === 0 ? (
        <div className="mt-[22px] rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
          没有找到匹配的鞋款，试试调整筛选条件
          <p className="mt-2.5 text-label text-ink-soft">
            <Link
              href="/shoes"
              className="underline underline-offset-3 transition-colors hover:text-trail"
            >
              清空全部筛选
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-[22px] grid gap-3.5 lg:grid-cols-3">
          {shoes.map((item) => (
            <li key={item.id}>
              <Link
                href={shoeHref(item.id, filters)}
                className="block h-full overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-hairline-strong"
              >
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 border-b border-border bg-surface-2">
                  {(() => {
                    const primaryImage = item.images[0];
                    if (primaryImage) {
                      return (
                        <img
                          src={primaryImage}
                          alt={`${item.brandName} ${item.model}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      );
                    }
                    return (
                      <>
                        <span className="micro-label">IMG · 主图 800×600</span>
                        <span className="micro-label text-[9px]">待真图</span>
                      </>
                    );
                  })()}
                </div>
                <div className="px-4 pb-4 pt-3.5">
                  <p className="micro-label">{item.brandName}</p>
                  <h2 className="mt-[3px] text-[15.5px] font-bold">
                    {item.model}
                  </h2>
                  <p className="mt-1.5 font-mono text-sm font-semibold">
                    ¥{item.price}
                  </p>
                  {item.matchAvgRating !== null ? (
                    <p className="mt-1.5 font-mono text-[11.5px] font-semibold text-primary">
                      匹配脚型均分 {item.matchAvgRating.toFixed(1)} ·{" "}
                      {item.matchReviewerCount} 人评过
                    </p>
                  ) : item.totalReviewCount > 0 ? (
                    <p className="mt-1.5 font-mono text-[11.5px] text-muted-foreground">
                      {item.totalReviewCount} 人评过
                    </p>
                  ) : null}
                  <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                    {[
                      ...item.scenarios,
                      item.stiffness,
                      item.width,
                      item.level,
                    ].join(" · ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
