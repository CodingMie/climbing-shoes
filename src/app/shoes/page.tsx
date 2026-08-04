import type { Metadata } from "next";
import Link from "next/link";
import {
  FilterActions,
  FilterSelect,
  filterFieldClass,
} from "@/components/shoes/filter-select";
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
  const brands = listBrands();
  const shoes = listShoes(filters);
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
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">鞋库</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        按鞋款属性或测评者脚型筛选
      </p>

      <form
        method="get"
        className="mt-6 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
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
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">价格区间（元）</span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              name="priceMin"
              min={0}
              placeholder="最低"
              defaultValue={filters.priceMin ?? ""}
              className={filterFieldClass}
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="number"
              name="priceMax"
              min={0}
              placeholder="最高"
              defaultValue={filters.priceMax ?? ""}
              className={filterFieldClass}
            />
          </span>
        </label>
        <p className="border-t pt-4 text-sm font-medium sm:col-span-2 lg:col-span-4">
          按脚型筛选
          <span className="ml-2 font-normal text-muted-foreground">
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
        <FilterActions clearHref="/shoes" showClear={hasActiveFilters} />
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        共 {shoes.length} 款
        {hasFootFilters ? " · 按匹配脚型测评者的平均分排序" : ""}
      </p>

      {shoes.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          没有找到匹配的鞋款，试试调整筛选条件
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shoes.map((item) => (
            <li key={item.id}>
              <Link
                href={shoeHref(item.id, filters)}
                className="block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {item.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={`${item.brandName} ${item.model}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                    暂无图片
                  </div>
                )}
                <div className="space-y-1.5 p-4">
                  <p className="text-xs text-muted-foreground">
                    {item.brandName}
                  </p>
                  <h2 className="font-semibold">{item.model}</h2>
                  <p className="text-sm">¥{item.price}</p>
                  {item.matchAvgRating !== null ? (
                    <p className="text-xs font-medium text-primary">
                      匹配脚型均分 {item.matchAvgRating.toFixed(1)} ·{" "}
                      {item.matchReviewerCount} 人评过
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
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
