import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FootSummaryLine } from "@/components/reviews/foot-summary";
import { Button } from "@/components/ui/button";
import { listShoeReviews, getReviewByUserAndShoe } from "@/lib/reviews";
import { formatSizeDelta } from "@/lib/reviews-schema";
import { getSession } from "@/lib/session";
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

  const session = await getSession();
  const reviews = listShoeReviews(shoe.id);
  const myReview = session
    ? getReviewByUserAndShoe(session.user.id, shoe.id)
    : null;

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
              <li key={item.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">
                    {item.authorUsername ?? item.authorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    综合 {item.overall} 分 · {item.sizeTried} {item.sizeSystem} ·{" "}
                    {formatSizeDelta(item.sizeDelta)}
                  </p>
                </div>
                <div className="mt-1">
                  <FootSummaryLine profile={item} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.content.length > 100
                    ? `${item.content.slice(0, 100)}…`
                    : item.content}
                </p>
                <Link
                  href={`/reviews/${item.id}`}
                  className="mt-3 inline-block text-sm hover:underline"
                >
                  查看完整测评 →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
