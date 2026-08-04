import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ARCH_LABELS,
  FOOT_WIDTH_LABELS,
  HEEL_LABELS,
} from "@/components/reviews/foot-summary";
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

  const footCells: {
    label: string;
    value: string;
    mono?: boolean;
  }[] | null = footProfileRow
    ? [
        {
          label: "脚宽窄",
          value:
            FOOT_WIDTH_LABELS[footProfileRow.footWidth] ??
            footProfileRow.footWidth,
        },
        {
          label: "足弓",
          value: ARCH_LABELS[footProfileRow.arch] ?? footProfileRow.arch,
        },
        {
          label: "脚后跟",
          value: HEEL_LABELS[footProfileRow.heel] ?? footProfileRow.heel,
        },
        { label: "拇外翻", value: footProfileRow.bunion },
        {
          label: "脚长",
          value: `${footProfileRow.footLength} mm`,
          mono: true,
        },
        {
          label: "日常鞋码",
          value: `EU ${footProfileRow.streetSize}`,
          mono: true,
        },
        { label: "脚型", value: footProfileRow.footShape },
        { label: "测评数", value: String(reviews.length), mono: true },
      ]
    : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <span className="micro-label">MEMBER · 脚型档案与测评</span>
      <h1 className="mt-1.5 text-[26px] font-black tracking-[-0.01em]">
        {displayName}
      </h1>

      {footCells ? (
        <dl className="mt-[18px] grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-hairline lg:grid-cols-4">
          {footCells.map((cell) => (
            <div key={cell.label} className="bg-card px-4 py-3.5">
              <dt className="micro-label">{cell.label}</dt>
              <dd
                className={
                  cell.mono
                    ? "mt-[5px] font-mono text-[15px] font-semibold"
                    : "mt-[5px] text-sm font-medium"
                }
              >
                {cell.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-[18px] rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
          TA 还没有填写脚型档案。
        </p>
      )}

      <section className="mt-[34px]">
        <h2 className="text-lg font-bold">TA 的测评（{reviews.length}）</h2>
        {reviews.length === 0 ? (
          <p className="mt-3.5 rounded-lg border border-dashed border-hairline-strong bg-card px-5 py-9 text-center text-[13px] text-muted-foreground">
            还没有发布过测评。
          </p>
        ) : (
          <ul className="mt-3.5 grid gap-3.5">
            {reviews.map((item) => (
              <ReviewCard key={item.id} review={item} showAuthor={false} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
