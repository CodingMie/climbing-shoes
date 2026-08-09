import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { user } from "@/db/schema";

export async function getUserByUsername(username: string) {
  return (
    (await getDb()
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
      })
      .from(user)
      .where(eq(user.username, username))
      .get()) ?? null
  );
}

export type PublicUser = NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>;
