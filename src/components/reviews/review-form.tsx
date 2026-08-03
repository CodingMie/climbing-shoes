"use client";

import { useState } from "react";
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
    <div className="space-y-2">
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
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
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
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {shoeId ? (
        <input type="hidden" name="shoeId" value={shoeId} />
      ) : null}
      {reviewId ? (
        <input type="hidden" name="reviewId" value={reviewId} />
      ) : null}

      <Section title="尺码信息" hint="尺码偏移相对你的日常鞋码（EU）计算">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
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
        <div className="grid gap-4 sm:grid-cols-2">
          {RATING_DIMENSIONS.map((dimension) => (
            <EnumSelect
              key={dimension}
              id={dimension}
              label={RATING_LABELS[dimension]}
              options={[1, 2, 3, 4, 5]}
              defaultValue={review?.[dimension]}
              renderOption={(value) => `${value} 分`}
            />
          ))}
        </div>
      </Section>

      <Section title="合身度反馈" hint="按实际试穿感受单选">
        <div className="grid gap-4 sm:grid-cols-2">
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
        <div className="space-y-2">
          <Label>使用场景（可多选）</Label>
          <div className="flex flex-wrap gap-4">
            {SHOE_SCENARIOS.map((scenario) => (
              <label
                key={scenario}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="scenariosUsed"
                  value={scenario}
                  defaultChecked={review?.scenariosUsed.includes(scenario)}
                  className="size-4 accent-primary"
                />
                {scenario}
              </label>
            ))}
          </div>
        </div>
        <EnumSelect
          id="duration"
          label="使用时长"
          options={DURATIONS}
          defaultValue={review?.duration}
        />
      </Section>

      <Section title="文字体验">
        <div className="space-y-2">
          <Label htmlFor="content">试穿体验</Label>
          <Textarea
            id="content"
            name="content"
            rows={5}
            placeholder="这双鞋上脚的整体感受……"
            defaultValue={review?.content ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pros">优点（可选）</Label>
            <Textarea
              id="pros"
              name="pros"
              rows={3}
              defaultValue={review?.pros ?? ""}
            />
          </div>
          <div className="space-y-2">
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

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "保存中…" : reviewId ? "保存修改" : "发布测评"}
      </Button>
    </form>
  );
}
