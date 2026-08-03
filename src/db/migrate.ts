import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export function migrateDatabase(dbPath: string): void {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  try {
    migrate(drizzle(sqlite), {
      migrationsFolder: path.resolve(process.cwd(), "drizzle"),
    });
  } finally {
    sqlite.close();
  }
}
