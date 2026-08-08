import { z } from "zod";
import {
  ARCH_FITS,
  BREATHABILITIES,
  DURATIONS,
  FOREFOOT_FITS,
  HEEL_FITS,
  INSTEP_FITS,
  SHOE_SCENARIOS,
  SIZE_DELTAS,
  SIZE_SYSTEMS,
  TOE_FITS,
  type RatingDimension,
  type SizeDelta,
} from "@/db/schema";

export const RATING_LABELS: Record<RatingDimension, string> = {
  wrap: "包裹性",
  comfort: "舒适",
  precision: "精准度",
  sensitivity: "灵敏度",
  friction: "摩擦",
  support: "支撑",
  overall: "综合推荐指数",
};

export const SIZE_DELTA_LABELS: Record<SizeDelta, string> = {
  "-5": "比日常小 5 码以上",
  "-4.5": "比日常小 4.5 码",
  "-4": "比日常小 4 码",
  "-3.5": "比日常小 3.5 码",
  "-3": "比日常小 3 码",
  "-2.5": "比日常小 2.5 码",
  "-2": "比日常小 2 码",
  "-1.5": "比日常小 1 码半",
  "-1": "比日常小 1 码",
  "-0.5": "比日常小半码",
  "0": "与日常码相同",
  "0.5": "比日常大半码",
  "1": "比日常大 1 码",
  "1.5": "比日常大 1 码半",
  "2": "比日常大 2 码",
  "2.5": "比日常大 2.5 码",
  "3": "比日常大 3 码",
  "3.5": "比日常大 3.5 码",
  "4": "比日常大 4 码",
  "4.5": "比日常大 4.5 码",
  "5": "比日常大 5 码以上",
};

export function formatSizeDelta(delta: number): string {
  return SIZE_DELTA_LABELS[delta as SizeDelta] ?? `${delta}`;
}

export const SIZE_TRIED_MIN = 1;
export const SIZE_TRIED_MAX = 60;
export const CONTENT_MIN = 5;
export const CONTENT_MAX = 2000;
export const PROS_CONS_MAX = 500;

const ratingField = (label: string) =>
  z
    .string()
    .min(1, `请为${label}打分`)
    .regex(/^[1-5]$/, `${label}评分须为 1–5 的整数`)
    .transform(Number);

export const reviewSchema = z.object({
  sizeTried: z
    .string()
    .trim()
    .min(1, "请输入试穿尺码")
    .regex(/^\d+(\.[05])?$/, "试穿尺码仅支持整码或半码（如 42 或 41.5）")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(SIZE_TRIED_MIN, "试穿尺码超出合理范围")
        .max(SIZE_TRIED_MAX, "试穿尺码超出合理范围"),
    ),
  sizeSystem: z.enum(SIZE_SYSTEMS, "请选择尺码体系"),
  sizeDelta: z
    .string()
    .trim()
    .min(1, "请选择相对日常码的尺码偏移")
    .regex(/^-?\d+(\.[05])?$/, "尺码偏移仅支持 0.5 步长")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(Math.min(...SIZE_DELTAS), "尺码偏移须在 -5 ～ +5 之间")
        .max(Math.max(...SIZE_DELTAS), "尺码偏移须在 -5 ～ +5 之间"),
    ),
  wrap: ratingField("包裹性"),
  comfort: ratingField("舒适"),
  precision: ratingField("精准度"),
  sensitivity: ratingField("灵敏度"),
  friction: ratingField("摩擦"),
  support: ratingField("支撑"),
  overall: ratingField("综合推荐指数"),
  heelFit: z.enum(HEEL_FITS, "请选择脚跟合身度"),
  toeFit: z.enum(TOE_FITS, "请选择脚趾合身度"),
  instepFit: z.enum(INSTEP_FITS, "请选择脚背合身度"),
  forefootFit: z.enum(FOREFOOT_FITS, "请选择前掌合身度"),
  archFit: z.enum(ARCH_FITS, "请选择足弓合身度"),
  breathability: z.enum(BREATHABILITIES, "请选择透气表现"),
  scenariosUsed: z
    .array(z.enum(SHOE_SCENARIOS))
    .min(1, "请至少选择一个使用场景"),
  duration: z.enum(DURATIONS, "请选择使用时长"),
  content: z
    .string()
    .trim()
    .min(CONTENT_MIN, `文字体验至少 ${CONTENT_MIN} 个字`)
    .max(CONTENT_MAX, `文字体验最长 ${CONTENT_MAX} 字`),
  pros: z.string().trim().max(PROS_CONS_MAX, `优点最长 ${PROS_CONS_MAX} 字`),
  cons: z.string().trim().max(PROS_CONS_MAX, `缺点最长 ${PROS_CONS_MAX} 字`),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export function reviewRawValues(source: FormData) {
  return {
    sizeTried: String(source.get("sizeTried") ?? ""),
    sizeSystem: String(source.get("sizeSystem") ?? ""),
    sizeDelta: String(source.get("sizeDelta") ?? ""),
    wrap: String(source.get("wrap") ?? ""),
    comfort: String(source.get("comfort") ?? ""),
    precision: String(source.get("precision") ?? ""),
    sensitivity: String(source.get("sensitivity") ?? ""),
    friction: String(source.get("friction") ?? ""),
    support: String(source.get("support") ?? ""),
    overall: String(source.get("overall") ?? ""),
    heelFit: String(source.get("heelFit") ?? ""),
    toeFit: String(source.get("toeFit") ?? ""),
    instepFit: String(source.get("instepFit") ?? ""),
    forefootFit: String(source.get("forefootFit") ?? ""),
    archFit: String(source.get("archFit") ?? ""),
    breathability: String(source.get("breathability") ?? ""),
    scenariosUsed: source.getAll("scenariosUsed").map(String),
    duration: String(source.get("duration") ?? ""),
    content: String(source.get("content") ?? ""),
    pros: String(source.get("pros") ?? ""),
    cons: String(source.get("cons") ?? ""),
  };
}
