"use client";

import { Fragment, useState } from "react";
import {
  submitReviewAction,
  updateReviewAction,
} from "@/app/reviews/actions";
import {
  ARCH_FITS,
  BREATHABILITIES,
  DURATIONS,
  FOREFOOT_FITS,
  HEEL_FITS,
  INSTEP_FITS,
  RATING_DIMENSIONS,
  SHOE_SCENARIOS,
  SIZE_DELTAS,
  SIZE_SYSTEMS,
  TOE_FITS,
} from "@/db/schema";
import {
  RATING_LABELS,
  formatSizeDelta,
  reviewRawValues,
  reviewSchema,
  type ReviewInput,
} from "@/lib/reviews-schema";
import { firstIssueMessage } from "@/lib/zod-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type ReviewFormValues = Omit<ReviewInput, "pros" | "cons"> & {
  pros: string | null;
  cons: string | null;
};

function EnumSelect({
  id,
  label,
  options,
  defaultValue,
  renderOption,
}: {
  id: string;
  label: string;
  options: readonly (string | number)[];
  defaultValue: string | number | undefined;
  renderOption?: (option: string) => string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} name={id} defaultValue={defaultValue ?? ""}>
        <option value="" disabled>
          请选择
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {renderOption ? renderOption(String(option)) : String(option)}
          </option>
        ))}
      </Select>
    </div>
  );
}

function RatingInput({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number | undefined;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-row-reverse justify-end gap-[3px] text-[19px] leading-none">
        {[5, 4, 3, 2, 1].map((value) => (
          <Fragment key={value}>
            <input
              type="radio"
              id={`${name}-${value}`}
              name={name}
              value={value}
              defaultChecked={defaultValue === value}
              className="peer sr-only"
            />
            <label
              htmlFor={`${name}-${value}`}
              aria-label={`${value} 分`}
              className="peer cursor-pointer text-hairline transition-colors hover:text-primary peer-checked:text-primary peer-hover:text-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50"
            >
              ★
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-[22px] border-t border-border pt-[22px] first-of-type:mt-0 first-of-type:border-t-0 first-of-type:pt-0">
      <h3 className="text-[15px] font-bold">{title}</h3>
      {hint ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {children}
    </section>
  );
}

export function ReviewForm({
  shoeId,
  reviewId,
  review,
}: {
  shoeId?: number;
  reviewId?: number;
  review?: ReviewFormValues;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = reviewSchema.safeParse(reviewRawValues(form));
    if (!parsed.success) {
      setError(firstIssueMessage(parsed.error));
      return;
    }
    setSubmitting(true);
    const action = reviewId ? updateReviewAction : submitReviewAction;
    const result = await action(form);
    if (result && !result.ok) {
      setError(result.error ?? "保存失败，请稍后重试");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {shoeId ? (
        <input type="hidden" name="shoeId" value={shoeId} />
      ) : null}
      {reviewId ? (
        <input type="hidden" name="reviewId" value={reviewId} />
      ) : null}

      <Section title="尺码信息" hint="尺码偏移相对你的日常鞋码（EU）计算">
        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="sizeTried">试穿尺码</Label>
            <Input
              id="sizeTried"
              name="sizeTried"
              type="number"
              inputMode="decimal"
              step={0.5}
              placeholder="如 41.5"
              defaultValue={review?.sizeTried ?? ""}
            />
          </div>
          <EnumSelect
            id="sizeSystem"
            label="尺码体系"
            options={SIZE_SYSTEMS}
            defaultValue={review?.sizeSystem}
          />
          <EnumSelect
            id="sizeDelta"
            label="相对日常码的偏移"
            options={SIZE_DELTAS.map(String)}
            defaultValue={review?.sizeDelta}
            renderOption={(value) => formatSizeDelta(Number(value))}
          />
        </div>
      </Section>

      <Section title="维度评分" hint="每项 1–5 分，5 分最好">
        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          {RATING_DIMENSIONS.map((dimension) => (
            <RatingInput
              key={dimension}
              name={dimension}
              label={RATING_LABELS[dimension]}
              defaultValue={review?.[dimension]}
            />
          ))}
        </div>
      </Section>

      <Section title="合身度反馈" hint="按实际试穿感受单选">
        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          <EnumSelect
            id="heelFit"
            label="脚跟"
            options={HEEL_FITS}
            defaultValue={review?.heelFit}
          />
          <EnumSelect
            id="toeFit"
            label="脚趾"
            options={TOE_FITS}
            defaultValue={review?.toeFit}
          />
          <EnumSelect
            id="instepFit"
            label="脚背"
            options={INSTEP_FITS}
            defaultValue={review?.instepFit}
          />
          <EnumSelect
            id="forefootFit"
            label="前掌"
            options={FOREFOOT_FITS}
            defaultValue={review?.forefootFit}
          />
          <EnumSelect
            id="archFit"
            label="足弓"
            options={ARCH_FITS}
            defaultValue={review?.archFit}
          />
          <EnumSelect
            id="breathability"
            label="透气"
            options={BREATHABILITIES}
            defaultValue={review?.breathability}
          />
        </div>
      </Section>

      <Section title="使用背景">
        <Label className="mt-3 block">使用场景（可多选）</Label>
        <div className="mt-2.5 flex flex-wrap gap-x-[18px] gap-y-2.5">
          {SHOE_SCENARIOS.map((scenario) => (
            <label
              key={scenario}
              className="flex items-center gap-[7px] text-[13px]"
            >
              <input
                type="checkbox"
                name="scenariosUsed"
                value={scenario}
                defaultChecked={review?.scenariosUsed.includes(scenario)}
                className="size-[15px] accent-pine"
              />
              {scenario}
            </label>
          ))}
        </div>
        <div className="mt-3.5 max-w-[320px]">
          <EnumSelect
            id="duration"
            label="使用时长"
            options={DURATIONS}
            defaultValue={review?.duration}
          />
        </div>
      </Section>

      <Section title="文字体验">
        <div className="mt-3.5 grid gap-1.5">
          <Label htmlFor="content">试穿体验</Label>
          <Textarea
            id="content"
            name="content"
            rows={4}
            placeholder="这双鞋上脚的整体感受……"
            defaultValue={review?.content ?? ""}
          />
        </div>
        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="pros">优点（可选）</Label>
            <Textarea
              id="pros"
              name="pros"
              rows={3}
              defaultValue={review?.pros ?? ""}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cons">缺点（可选）</Label>
            <Textarea
              id="cons"
              name="cons"
              rows={3}
              defaultValue={review?.cons ?? ""}
            />
          </div>
        </div>
      </Section>

      <div className="mt-[26px] flex items-center gap-3.5">
        <Button type="submit" disabled={submitting}>
          {submitting ? "保存中…" : reviewId ? "保存修改" : "发布测评"}
        </Button>
        {error ? (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
