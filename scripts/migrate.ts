import { databasePath } from "../src/db/path.ts";
import { migrateDatabase } from "../src/db/migrate.ts";

const dbPath = databasePath();
migrateDatabase(dbPath);
console.log(`migrated: ${dbPath}`);
