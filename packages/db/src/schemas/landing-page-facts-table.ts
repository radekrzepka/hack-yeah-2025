import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const factsTable = pgTable("factsTable", {
  id: uuid().primaryKey().defaultRandom(),
  fact: varchar({ length: 3000 }).unique().notNull(),
  source: varchar({ length: 3000 }).notNull(),
});

export type FactsTableSelect = InferSelectModel<typeof factsTable>;
export type FactsTableInsert = InferInsertModel<typeof factsTable>;
