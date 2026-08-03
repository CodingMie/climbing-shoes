import type { Metadata } from "next";
import Link from "next/link";
import {
  SHOE_LEVELS,
  SHOE_SCENARIOS,
  SHOE_STIFFNESS,
  SHOE_WIDTHS,
} from "@/db/schema";
import { listBrands, listShoes, parseShoeFilters } from "@/lib/shoes";

export const metadata: Metadata = {
  title: "鞋库",
};

const fieldClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

function FilterSelect({
  name,
  label,
  value,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  value?: string | number;
  placeholder: string;
  options: { value: string | number; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className={fieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
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
  const hasActiveFilters =
    filters.brandId !== undefined ||
    filters.scenario !== undefined ||
    filters.stiffness !== undefined ||
    filters.width !== undefined ||
    filters.level !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.q !== undefined;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">鞋库</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        按属性组合筛选，或搜索品牌 / 型号 / 变体
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
              className={fieldClass}
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="number"
              name="priceMax"
              min={0}
              placeholder="最高"
              defaultValue={filters.priceMax ?? ""}
              className={fieldClass}
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2 lg:col-span-3">
          <span className="text-muted-foreground">关键词</span>
          <input
            type="search"
            name="q"
            placeholder="搜索品牌 / 型号 / 变体"
            defaultValue={filters.q ?? ""}
            className={fieldClass}
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-9 flex-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            筛选
          </button>
          {hasActiveFilters ? (
            <Link
              href="/shoes"
              className="flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-muted"
            >
              清空
            </Link>
          ) : null}
        </div>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        共 {shoes.length} 款
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
                href={`/shoes/${item.id}`}
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
                  <h2 className="font-semibold">
                    {item.model}
                    {item.variant ? ` ${item.variant}` : ""}
                  </h2>
                  <p className="text-sm">¥{item.price}</p>
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
