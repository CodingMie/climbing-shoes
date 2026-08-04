import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import { getFootProfile } from "@/lib/foot-profile";
import { parsePositiveInt } from "@/lib/params";
import { getReviewByUserAndShoe } from "@/lib/reviews";
import { requireUser } from "@/lib/session";
import { formatShoeTitle, getShoe } from "@/lib/shoes";

export const metadata: Metadata = {
  title: "写测评",
};

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ shoe?: string }>;
}) {
  const session = await requireUser();
  const { shoe } = await searchParams;
  const shoeId = parsePositiveInt(shoe);
  if (!shoeId) notFound();
  const shoeDetail = getShoe(shoeId);
  if (!shoeDetail) notFound();

  const existing = getReviewByUserAndShoe(session.user.id, shoeId);
  if (existing) redirect(`/reviews/${existing.id}/edit`);

  const shoeTitle = formatShoeTitle(shoeDetail);

  if (!getFootProfile(session.user.id)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-[26px] font-black tracking-[-0.01em]">写测评</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          目标鞋款：{shoeTitle}
        </p>
        <div className="mt-[26px] rounded-lg border border-border bg-card p-6">
          <h2 className="text-[15px] font-bold">
            写测评前，请先完善脚型档案
          </h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            脚型档案是测评参考价值的来源：读者需要对照作者的脚型来判断一条测评是否适合自己。完善档案后才能提交测评。
          </p>
          <Button asChild className="mt-4">
            <Link href="/settings/profile">去完善脚型档案</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href={`/shoes/${shoeId}`}
        className="text-label text-muted-foreground transition-colors hover:text-trail"
      >
        ← 返回鞋款详情
      </Link>
      <h1 className="mt-3.5 text-[26px] font-black tracking-[-0.01em]">
        写测评
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        目标鞋款：{shoeTitle}
      </p>
      <div className="mt-[26px]">
        <ReviewForm shoeId={shoeId} />
      </div>
    </main>
  );
}
