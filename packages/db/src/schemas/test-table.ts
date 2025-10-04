import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const testTable = pgTable("testTable", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: MAX_EMAIL_LENGTH }).unique().notNull(),
  firstName: varchar({ length: MAX_NAME_LENGTH }).notNull(),
});

export type TestTableSelect = InferSelectModel<typeof testTable>;
export type TestTableInsert = InferInsertModel<typeof testTable>;
