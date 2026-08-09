import path from "node:path";

export const E2E_DATABASE_PATH = path.resolve("data", "e2e.db");

export function databasePath(): string {
  return path.resolve(process.env.DATABASE_PATH ?? path.join("data", "app.db"));
}

export function localDatabaseUrl(): string {
  return `file:${databasePath()}`;
}

export function isUsingTurso(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function getDatabaseUrl(): string {
  return process.env.TURSO_DATABASE_URL ?? localDatabaseUrl();
}

export function getDatabaseAuthToken(): string | undefined {
  return process.env.TURSO_AUTH_TOKEN || undefined;
}
