import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { footProfile } from "@/db/schema";
import type { FootProfileInput } from "./foot-profile-schema";

export type FootProfile = typeof footProfile.$inferSelect;

export async function getFootProfile(userId: string): Promise<FootProfile | null> {
  return (
    (await getDb()
      .select()
      .from(footProfile)
      .where(eq(footProfile.userId, userId))
      .get()) ?? null
  );
}

export async function upsertFootProfile(
  userId: string,
  input: FootProfileInput,
): Promise<void> {
  const now = new Date();
  await getDb()
    .insert(footProfile)
    .values({ userId, ...input, updatedAt: now })
    .onConflictDoUpdate({
      target: footProfile.userId,
      set: { ...input, updatedAt: now },
    })
    .run();
}
