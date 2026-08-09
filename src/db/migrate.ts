import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

export async function migrateDatabase(
  url: string,
  authToken?: string,
): Promise<void> {
  if (url.startsWith("file:")) {
    fs.mkdirSync(path.dirname(url.slice("file:".length)), { recursive: true });
  }
  const client = createClient({ url, authToken });
  try {
    await migrate(drizzle(client), {
      migrationsFolder: path.resolve(process.cwd(), "drizzle"),
    });
  } finally {
    client.close();
  }
}
