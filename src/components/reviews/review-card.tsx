import Link from "next/link";
import { formatSizeDelta } from "@/lib/reviews-schema";
import { formatShoeTitle } from "@/lib/shoes";
import { FootSummaryLine } from "./foot-summary";

export type ReviewCardData = {
  id: number;
  overall: number;
  sizeTried: number;
  sizeSystem: string;
  sizeDelta: number;
  content: string;
  createdAt: Date;
  shoeId?: number;
  shoeModel?: string;
  shoeVariant?: string | null;
  brandName?: string;
  authorName?: string;
  authorUsername?: string | null;
  footWidth?: string | null;
  arch?: string | null;
  instep?: string | null;
  heel?: string | null;
  bunion?: string | null;
};

const EXCERPT_LENGTH = 100;

function formatCardDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function ReviewCard({
  review,
  showShoe = true,
  showAuthor = true,
}: {
  review: ReviewCardData;
  showShoe?: boolean;
  showAuthor?: boolean;
}) {
  const authorDisplay = review.authorUsername ?? review.authorName;
  const shoeTitle =
    review.brandName && review.shoeModel
      ? formatShoeTitle({
          brandName: review.brandName,
          model: review.shoeModel,
          variant: review.shoeVariant ?? null,
        })
      : null;

  return (
    <li className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {showShoe && shoeTitle && review.shoeId ? (
            <Link
              href={`/shoes/${review.shoeId}`}
              className="text-sm font-semibold hover:underline"
            >
              {shoeTitle}
            </Link>
          ) : null}
          {showAuthor && authorDisplay ? (
            review.authorUsername ? (
              <Link
                href={`/u/${review.authorUsername}`}
                className={
                  showShoe
                    ? "mt-0.5 block text-xs text-muted-foreground hover:underline"
                    : "text-sm font-semibold hover:underline"
                }
              >
                {showShoe ? `by ${authorDisplay}` : authorDisplay}
              </Link>
            ) : (
              <p
                className={
                  showShoe
                    ? "mt-0.5 text-xs text-muted-foreground"
                    : "text-sm font-semibold"
                }
              >
                {showShoe ? `by ${authorDisplay}` : authorDisplay}
              </p>
            )
          ) : null}
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          综合 {review.overall} 分 · {review.sizeTried} {review.sizeSystem} ·{" "}
          {formatSizeDelta(review.sizeDelta)}
        </p>
      </div>

      <div className="mt-1">
        <FootSummaryLine profile={review} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {review.content.length > EXCERPT_LENGTH
          ? `${review.content.slice(0, EXCERPT_LENGTH)}…`
          : review.content}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <Link
          href={`/reviews/${review.id}`}
          className="text-sm hover:underline"
        >
          查看完整测评 →
        </Link>
        <span className="text-xs text-muted-foreground">
          {formatCardDate(review.createdAt)}
        </span>
      </div>
    </li>
  );
}
