import Link from "next/link";
import { ReviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";
import { listLatestReviews } from "@/lib/reviews";
import { getSession } from "@/lib/session";

const LATEST_LIMIT = 8;

export default async function Home() {
  const latestReviews = listLatestReviews(LATEST_LIMIT);
  const session = await getSession();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          攀岩鞋试穿体验平台
        </h1>
        <p className="text-lg text-muted-foreground">
          记录真实试穿体验，按脚型与场景找到合脚的那双鞋
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button asChild>
            <Link href="/shoes">浏览鞋库</Link>
          </Button>
          {session ? null : (
            <Button asChild variant="outline">
              <Link href="/register">注册并记录你的脚型</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">最新测评</h2>
          {latestReviews.length > 0 ? (
            <Link
              href="/shoes"
              className="text-sm text-muted-foreground hover:underline"
            >
              去鞋库找一双 →
            </Link>
          ) : null}
        </div>

        {latestReviews.length === 0 ? (
          <p className="mt-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            还没有测评。注册后试穿一双鞋，来写下第一条测评吧。
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {latestReviews.map((item) => (
              <ReviewCard key={item.id} review={item} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
