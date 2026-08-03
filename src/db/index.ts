import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { databasePath } from "./path";
import * as schema from "./schema";

export type Db = BetterSQLite3Database<typeof schema>;

let instance: Db | undefined;

export function getDb(): Db {
  if (!instance) {
    const file = databasePath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const sqlite = new Database(file);
    sqlite.pragma("journal_mode = WAL");
    instance = drizzle(sqlite, { schema });
  }
  return instance;
}
