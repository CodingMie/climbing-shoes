import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins/username";
import { getDb } from "@/db";
import { account, session, user, verification } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [username()],
  baseURL: process.env.BETTER_AUTH_URL ?? {
    protocol: "http",
    allowedHosts: [
      "localhost:3000",
      "localhost:3100",
      "127.0.0.1:3000",
      "127.0.0.1:3100",
    ],
    fallback: "http://localhost:3000",
  },
  secret:
    process.env.BETTER_AUTH_SECRET ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "dev-only-secret-a3d5b0d97db4c4110c924edcc2e15be6c43b7fc878a1481e1407d680821f1f01"),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
});

export type Session = typeof auth.$Infer.Session;
