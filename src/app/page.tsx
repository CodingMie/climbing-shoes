import Link from "next/link";
import { ReviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";
import { listLatestReviews } from "@/lib/reviews";
import { getSession } from "@/lib/session";

const LATEST_LIMIT = 8;

export default async function Home() {
  const latestReviews = await listLatestReviews(LATEST_LIMIT);
  const session = await getSession();

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-5xl px-4 pb-7 pt-7 md:px-7 sm:pb-9 sm:pt-11">
          <p className="micro-label">
            社区 · COMMUNITY LOG
          </p>
          <h1 className="mt-3 text-[27px] font-black leading-[1.18] tracking-[-0.015em] sm:text-[38px]">
            攀岩鞋试穿体验平台
          </h1>
          <p className="mt-3 max-w-[40ch] text-[14.5px] text-ink-soft">
            记录真实试穿体验，按脚型与场景找到合脚的那双鞋
          </p>
          <div className="mt-[22px] flex flex-wrap gap-2.5">
            <Button asChild>
              <Link href="/shoes">浏览鞋库</Link>
            </Button>
            {session ? null : (
              <Button asChild variant="outline">
                <Link href="/register">注册并记录你的脚型</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-11 pt-8 md:px-7">
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">最新测评</h2>
          {latestReviews.length > 0 ? (
            <Link
              href="/shoes"
              className="text-label text-muted-foreground transition-colors hover:text-trail"
            >
              去鞋库找一双 →
            </Link>
          ) : null}
        </div>

        {latestReviews.length === 0 ? (
          <p className="rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
            还没有测评。注册后试穿一双鞋，来写下第一条测评吧。
          </p>
        ) : (
          <ul className="grid gap-3.5">
            {latestReviews.map((item) => (
              <ReviewCard key={item.id} review={item} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
