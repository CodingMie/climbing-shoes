import { z } from "zod";
import {
  ARCH_TYPES,
  BUNION_LEVELS,
  FOOT_SHAPES,
  FOOT_WIDTHS,
  HEEL_WIDTHS,
  INSTEP_TYPES,
} from "@/db/schema";

export const FOOT_LENGTH_MIN = 150;
export const FOOT_LENGTH_MAX = 350;
export const STREET_SIZE_MIN = 30;
export const STREET_SIZE_MAX = 50;

export const footProfileSchema = z.object({
  footLength: z
    .string()
    .trim()
    .min(1, "请输入脚长")
    .regex(/^\d+$/, "脚长须为整数（单位：毫米）")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(FOOT_LENGTH_MIN, `脚长须在 ${FOOT_LENGTH_MIN}–${FOOT_LENGTH_MAX} 毫米之间`)
        .max(FOOT_LENGTH_MAX, `脚长须在 ${FOOT_LENGTH_MIN}–${FOOT_LENGTH_MAX} 毫米之间`),
    ),
  footWidth: z.enum(FOOT_WIDTHS, "请选择脚宽窄"),
  footShape: z.enum(FOOT_SHAPES, "请选择脚型"),
  arch: z.enum(ARCH_TYPES, "请选择足弓类型"),
  instep: z.enum(INSTEP_TYPES, "请选择脚背高度"),
  heel: z.enum(HEEL_WIDTHS, "请选择脚后跟宽窄"),
  bunion: z.enum(BUNION_LEVELS, "请选择拇外翻程度"),
  streetSize: z
    .string()
    .trim()
    .min(1, "请输入日常鞋码")
    .regex(/^\d+(\.[05])?$/, "日常鞋码仅支持整码或半码（如 42 或 42.5）")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(STREET_SIZE_MIN, `日常鞋码（EU）须在 ${STREET_SIZE_MIN}–${STREET_SIZE_MAX} 之间`)
        .max(STREET_SIZE_MAX, `日常鞋码（EU）须在 ${STREET_SIZE_MIN}–${STREET_SIZE_MAX} 之间`),
    ),
});

export type FootProfileInput = z.infer<typeof footProfileSchema>;

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "输入有误，请检查后重试";
}

export function footProfileRawValues(source: {
  get(name: string): FormDataEntryValue | null;
}) {
  return {
    footLength: String(source.get("footLength") ?? ""),
    footWidth: String(source.get("footWidth") ?? ""),
    footShape: String(source.get("footShape") ?? ""),
    arch: String(source.get("arch") ?? ""),
    instep: String(source.get("instep") ?? ""),
    heel: String(source.get("heel") ?? ""),
    bunion: String(source.get("bunion") ?? ""),
    streetSize: String(source.get("streetSize") ?? ""),
  };
}
