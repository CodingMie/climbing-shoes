import path from "node:path";

export const E2E_DATABASE_PATH = path.resolve("data", "e2e.db");

export function databasePath(): string {
  return path.resolve(process.env.DATABASE_PATH ?? path.join("data", "app.db"));
}
