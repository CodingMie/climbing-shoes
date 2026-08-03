import type { z } from "zod";

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "输入有误，请检查后重试";
}
