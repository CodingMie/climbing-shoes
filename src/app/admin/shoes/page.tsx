import type { Metadata } from "next";
import { listBrands, listShoes, formatShoeTitle } from "@/lib/shoes";
import { ShoeActions } from "./shoe-actions";

export const metadata: Metadata = {
  title: "鞋款管理",
};

export default async function AdminShoesPage() {
  const brands = await listBrands();
  const shoes = await listShoes();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h1 className="text-[26px] font-black tracking-[-0.01em]">鞋款管理</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            管理数据库中的所有鞋款信息
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          共 {shoes.length} 款 · {brands.length} 个品牌
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">鞋款列表</h2>
            </div>
            <div className="divide-y divide-border">
              {shoes.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  暂无鞋款数据
                </div>
              ) : (
                shoes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-surface-2">
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={formatShoeTitle(item)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          IMG
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted-foreground">
                        {item.brandName}
                      </p>
                      <p className="truncate text-sm font-medium">
                        {item.model}
                      </p>
                    </div>
                    <div className="hidden text-right font-mono text-xs text-muted-foreground sm:block">
                      ¥{item.price}
                    </div>
                    <div className="hidden text-right text-xs text-muted-foreground md:block">
                      {item.scenarios.join(" · ")}
                    </div>
                    <ShoeActions
                      shoeId={item.id}
                      shoeTitle={formatShoeTitle(item)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">品牌管理</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              管理品牌信息
            </p>
            <div className="mt-4 divide-y divide-border">
              {brands.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
