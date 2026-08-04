import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FootSummaryLine, FootStatsLine } from "@/components/reviews/foot-summary";
import { ReviewCard } from "@/components/reviews/review-card";
import { getFootProfile } from "@/lib/foot-profile";
import { listUserReviews } from "@/lib/reviews";
import { getUserByUsername } from "@/lib/users";

type RouteParams = { username: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { username } = await params;
  const profileUser = getUserByUsername(username);
  if (!profileUser) return { title: "用户不存在" };
  return {
    title: `${profileUser.username ?? profileUser.name} 的主页`,
  };
}

export default async function UserHomePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { username } = await params;
  const profileUser = getUserByUsername(username);
  if (!profileUser) notFound();

  const footProfileRow = getFootProfile(profileUser.id);
  const reviews = listUserReviews(profileUser.id);
  const displayName = profileUser.username ?? profileUser.name;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">{displayName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">脚型档案与测评</p>

      <section className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold">脚型档案摘要</h2>
        {footProfileRow ? (
          <div className="mt-2 space-y-1">
            <FootSummaryLine profile={footProfileRow} />
            <FootStatsLine profile={footProfileRow} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            TA 还没有填写脚型档案。
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">TA 的测评（{reviews.length}）</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            还没有发布过测评。
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((item) => (
              <ReviewCard key={item.id} review={item} showAuthor={false} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
