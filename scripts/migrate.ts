import {
  getDatabaseAuthToken,
  getDatabaseUrl,
} from "../src/db/path.ts";
import { migrateDatabase } from "../src/db/migrate.ts";

const url = getDatabaseUrl();
await migrateDatabase(url, getDatabaseAuthToken());
const label = url.startsWith("file:")
  ? url.replace(/^file:/, "")
  : `turso (${url})`;
console.log(`migrated: ${label}`);