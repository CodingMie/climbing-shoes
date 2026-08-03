import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { footProfile } from "@/db/schema";
import type { FootProfileInput } from "./foot-profile-schema";

export type FootProfile = typeof footProfile.$inferSelect;

export function getFootProfile(userId: string): FootProfile | null {
  return (
    getDb()
      .select()
      .from(footProfile)
      .where(eq(footProfile.userId, userId))
      .get() ?? null
  );
}

export function upsertFootProfile(
  userId: string,
  input: FootProfileInput,
): void {
  const now = new Date();
  getDb()
    .insert(footProfile)
    .values({ userId, ...input, updatedAt: now })
    .onConflictDoUpdate({
      target: footProfile.userId,
      set: { ...input, updatedAt: now },
    })
    .run();
}
