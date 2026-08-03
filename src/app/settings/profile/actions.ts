"use server";

import { getSession } from "@/lib/session";
import {
  firstIssueMessage,
  footProfileRawValues,
  footProfileSchema,
} from "@/lib/foot-profile-schema";
import { upsertFootProfile } from "@/lib/foot-profile";

export type SaveFootProfileResult = { ok: boolean; error?: string };

export async function saveFootProfileAction(
  formData: FormData,
): Promise<SaveFootProfileResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "请先登录" };
  }
  const parsed = footProfileSchema.safeParse(
    footProfileRawValues(formData),
  );
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  upsertFootProfile(session.user.id, parsed.data);
  return { ok: true };
}
