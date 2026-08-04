"use client";

import { useState } from "react";
import { saveFootProfileAction } from "@/app/settings/profile/actions";
import {
  ARCH_TYPES,
  BUNION_LEVELS,
  FOOT_SHAPES,
  FOOT_WIDTHS,
  HEEL_WIDTHS,
  INSTEP_TYPES,
} from "@/db/schema";
import type { FootProfile } from "@/lib/foot-profile";
import {
  FOOT_LENGTH_MAX,
  FOOT_LENGTH_MIN,
  STREET_SIZE_MAX,
  STREET_SIZE_MIN,
  footProfileRawValues,
  footProfileSchema,
} from "@/lib/foot-profile-schema";
import { firstIssueMessage } from "@/lib/zod-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

function EnumField({
  id,
  label,
  options,
  defaultValue,
}: {
  id: string;
  label: string;
  options: readonly string[];
  defaultValue: string | undefined;
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
            {option}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function FootProfileForm({
  profile,
}: {
  profile: FootProfile | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    const form = new FormData(event.currentTarget);
    const parsed = footProfileSchema.safeParse(footProfileRawValues(form));
    if (!parsed.success) {
      setError(firstIssueMessage(parsed.error));
      return;
    }
    setSubmitting(true);
    const result = await saveFootProfileAction(form);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "保存失败，请稍后重试");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-[22px]">
      <div className="grid gap-3.5 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="footLength">脚长（毫米）</Label>
          <Input
            id="footLength"
            name="footLength"
            type="number"
            inputMode="numeric"
            min={FOOT_LENGTH_MIN}
            max={FOOT_LENGTH_MAX}
            step={1}
            placeholder="如 255"
            defaultValue={profile?.footLength ?? ""}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="streetSize">日常鞋码（EU）</Label>
          <Input
            id="streetSize"
            name="streetSize"
            type="number"
            inputMode="decimal"
            min={STREET_SIZE_MIN}
            max={STREET_SIZE_MAX}
            step={0.5}
            placeholder="如 42.5，支持半码"
            defaultValue={profile?.streetSize ?? ""}
          />
        </div>
        <EnumField
          id="footShape"
          label="脚型"
          options={FOOT_SHAPES}
          defaultValue={profile?.footShape}
        />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-3">
        <EnumField
          id="footWidth"
          label="脚宽窄"
          options={FOOT_WIDTHS}
          defaultValue={profile?.footWidth}
        />
        <EnumField
          id="arch"
          label="足弓"
          options={ARCH_TYPES}
          defaultValue={profile?.arch}
        />
        <EnumField
          id="instep"
          label="脚背"
          options={INSTEP_TYPES}
          defaultValue={profile?.instep}
        />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-3">
        <EnumField
          id="heel"
          label="脚后跟"
          options={HEEL_WIDTHS}
          defaultValue={profile?.heel}
        />
        <EnumField
          id="bunion"
          label="拇外翻"
          options={BUNION_LEVELS}
          defaultValue={profile?.bunion}
        />
        <div className="flex items-end">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "保存中…" : "保存档案"}
          </Button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-label text-destructive">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p role="status" className="text-label text-muted-foreground">
          脚型档案已保存
        </p>
      ) : null}
    </form>
  );
}
