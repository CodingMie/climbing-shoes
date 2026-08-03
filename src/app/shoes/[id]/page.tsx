import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShoe } from "@/lib/shoes";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const shoe = await findShoe(params);
  if (!shoe) return { title: "鞋款不存在" };
  return {
    title: `${shoe.brandName} ${shoe.model}${shoe.variant ? ` ${shoe.variant}` : ""}`,
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
}: {
  params: Promise<RouteParams>;
}) {
  const shoe = await findShoe(params);
  if (!shoe) notFound();

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
          <h1 className="mt-1 text-3xl font-bold">
            {shoe.model}
            {shoe.variant ? ` ${shoe.variant}` : ""}
          </h1>
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
        </div>
      </div>
    </main>
  );
}
