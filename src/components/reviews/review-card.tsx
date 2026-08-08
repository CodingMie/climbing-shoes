import Link from "next/link";
import { footSummaryLabels } from "./foot-summary";

export type ReviewCardData = {
  id: number;
  overall: number;
  content: string;
  createdAt: Date;
  shoeId?: number;
  shoeModel?: string;
  brandName?: string;
  authorName?: string;
  authorUsername?: string | null;
  footLength?: number | null;
  footWidth?: string | null;
  footShape?: string | null;
  arch?: string | null;
  instep?: string | null;
  heel?: string | null;
  bunion?: string | null;
  streetSize?: number | null;
};

const EXCERPT_LENGTH = 100;

const MICRO_CLASS = "micro-label";

function formatCardDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function footStatsText(review: ReviewCardData): string | null {
  const parts: string[] = [];
  if (review.footLength) parts.push(`脚长 ${review.footLength}mm`);
  if (review.streetSize) parts.push(`日常 EU ${review.streetSize}`);
  if (review.footShape) parts.push(`脚型 ${review.footShape}`);
  return parts.length > 0 ? parts.join(" · ") : null;
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
  const footLabels = footSummaryLabels(review);
  const statsText = footStatsText(review);
  const showShoeBlock = Boolean(showShoe && review.shoeId && review.shoeModel);

  return (
    <li className="rounded-lg border border-border bg-card px-5 py-[18px] transition-colors hover:border-hairline-strong">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {showShoeBlock ? (
            <>
              {review.brandName ? (
                <span className={MICRO_CLASS}>{review.brandName}</span>
              ) : null}
              <h3 className="mt-[3px] text-[16.5px] font-bold">
                <Link
                  href={`/shoes/${review.shoeId}`}
                  className="hover:underline hover:underline-offset-[3px]"
                >
                  {review.shoeModel}
                </Link>
              </h3>
            </>
          ) : null}
          {showAuthor && (authorDisplay || footLabels.length > 0) ? (
            <p
              className={
                showShoeBlock
                  ? "mt-1 text-xs text-muted-foreground"
                  : "text-xs text-muted-foreground"
              }
            >
              {authorDisplay ? (
                <>
                  {showShoeBlock ? "by " : null}
                  {review.authorUsername ? (
                    <Link
                      href={`/u/${review.authorUsername}`}
                      className="font-medium text-ink-soft hover:underline"
                    >
                      {authorDisplay}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink-soft">
                      {authorDisplay}
                    </span>
                  )}
                </>
              ) : null}
              {footLabels.length > 0
                ? `${authorDisplay ? " · " : ""}${footLabels.join(" · ")}`
                : null}
            </p>
          ) : null}
          {statsText ? (
            <p
              className={
                showShoeBlock || showAuthor
                  ? "mt-0.5 font-mono text-[11px] text-muted-foreground"
                  : "font-mono text-[11px] text-muted-foreground"
              }
            >
              {statsText}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <span className={MICRO_CLASS}>综合</span>
          <span className="block font-mono text-[22px] font-semibold leading-[1.1]">
            {review.overall}
          </span>
          <span className="font-mono text-[10.5px] text-muted-foreground">
            / 5
          </span>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-[1.75] text-ink-soft">
        {review.content.length > EXCERPT_LENGTH
          ? `${review.content.slice(0, EXCERPT_LENGTH)}…`
          : review.content}
      </p>

      <div className="mt-[14px] flex items-center justify-between border-t border-border pt-3">
        <Link
          href={`/reviews/${review.id}`}
          className="text-label font-medium transition-colors hover:text-trail"
        >
          查看完整测评 →
        </Link>
        <span className="font-mono text-[11px] text-muted-foreground">
          {formatCardDate(review.createdAt)}
        </span>
      </div>
    </li>
  );
}
