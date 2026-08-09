import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import {
  databasePath,
  getDatabaseAuthToken,
  getDatabaseUrl,
  isUsingTurso,
} from "./path.ts";
import * as schema from "./schema.ts";

export type Db = LibSQLDatabase<typeof schema>;

let instance: Db | undefined;

export function getDb(): Db {
  if (!instance) {
    if (!isUsingTurso()) {
      fs.mkdirSync(path.dirname(databasePath()), { recursive: true });
    }
    const client = createClient({
      url: getDatabaseUrl(),
      authToken: getDatabaseAuthToken(),
    });
    instance = drizzle(client, { schema });
  }
  return instance;
}
