import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const SHOE_SCENARIOS = [
  "馆内全能",
  "抱石",
  "难度",
  "传统多段",
  "竞技",
] as const;
export const SHOE_STIFFNESS = ["软", "中", "硬"] as const;
export const SHOE_WIDTHS = ["窄", "中", "宽"] as const;
export const SHOE_LEVELS = ["入门", "进阶", "极致性能"] as const;
export const SHOE_DOWNTURNS = ["自然", "适度", "激进"] as const;
export const SHOE_CLOSURES = ["魔术贴", "系带", "套脚"] as const;
export const SHOE_STATUSES = ["pending", "approved", "rejected"] as const;

export const FOOT_WIDTHS = ["窄", "中", "宽"] as const;
export const FOOT_SHAPES = ["埃及脚", "希腊脚", "罗马脚"] as const;
export const ARCH_TYPES = ["低", "正常", "高"] as const;
export const INSTEP_TYPES = ["低", "正常", "高"] as const;
export const HEEL_WIDTHS = ["窄", "中", "宽"] as const;
export const BUNION_LEVELS = ["无", "轻度", "中度", "重度"] as const;

export type ShoeScenario = (typeof SHOE_SCENARIOS)[number];
export type FootWidth = (typeof FOOT_WIDTHS)[number];
export type FootShape = (typeof FOOT_SHAPES)[number];
export type ArchType = (typeof ARCH_TYPES)[number];
export type InstepType = (typeof INSTEP_TYPES)[number];
export type HeelWidth = (typeof HEEL_WIDTHS)[number];
export type BunionLevel = (typeof BUNION_LEVELS)[number];

export const brand = sqliteTable("brand", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
});

export const shoe = sqliteTable("shoe", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brand.id),
  model: text("model").notNull(),
  variant: text("variant"),
  price: integer("price").notNull(),
  scenarios: text("scenarios", { mode: "json" })
    .$type<ShoeScenario[]>()
    .notNull(),
  stiffness: text("stiffness", { enum: SHOE_STIFFNESS }).notNull(),
  width: text("width", { enum: SHOE_WIDTHS }).notNull(),
  level: text("level", { enum: SHOE_LEVELS }).notNull(),
  downturn: text("downturn", { enum: SHOE_DOWNTURNS }).notNull(),
  closure: text("closure", { enum: SHOE_CLOSURES }).notNull(),
  material: text("material"),
  images: text("images", { mode: "json" }).$type<string[]>().notNull(),
  status: text("status", { enum: SHOE_STATUSES })
    .notNull()
    .default("pending"),
  submittedBy: text("submitted_by"),
  reviewedBy: text("reviewed_by"),
  rejectReason: text("reject_reason"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
});

export const footProfile = sqliteTable("foot_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  footLength: integer("foot_length").notNull(),
  footWidth: text("foot_width", { enum: FOOT_WIDTHS }).notNull(),
  footShape: text("foot_shape", { enum: FOOT_SHAPES }).notNull(),
  arch: text("arch", { enum: ARCH_TYPES }).notNull(),
  instep: text("instep", { enum: INSTEP_TYPES }).notNull(),
  heel: text("heel", { enum: HEEL_WIDTHS }).notNull(),
  bunion: text("bunion", { enum: BUNION_LEVELS }).notNull(),
  streetSize: real("street_size").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
