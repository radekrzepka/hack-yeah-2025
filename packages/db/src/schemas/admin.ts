import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const adminTable = pgTable("admin", {
  id: uuid().primaryKey().defaultRandom(),
  login: varchar({ length: 50 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
});

export type AdminSelect = InferSelectModel<typeof adminTable>;
export type AdminInsert = InferInsertModel<typeof adminTable>;
