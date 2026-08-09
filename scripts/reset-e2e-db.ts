import fs from "node:fs";
import { E2E_DATABASE_PATH } from "../src/db/path.ts";
import { migrateDatabase } from "../src/db/migrate.ts";

for (const suffix of ["", "-wal", "-shm"]) {
  fs.rmSync(E2E_DATABASE_PATH + suffix, { force: true });
}
await migrateDatabase(`file:${E2E_DATABASE_PATH}`);
console.log(`reset e2e database: ${E2E_DATABASE_PATH}`);