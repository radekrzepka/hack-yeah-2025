import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const chartsTable = pgTable("chartsTable", {
  id: uuid().primaryKey().defaultRandom(),
  chartName: varchar("chart_name", { length: 255 }).notNull(),
  chartType: varchar("chart_type", { length: 255 }).notNull(),
  chartData: jsonb("chart_data").notNull(),
  source: varchar("source", { length: 255 }).notNull(),
});

export type ChartTableSelect = InferSelectModel<typeof chartsTable>;
export type ChartTableInsert = InferInsertModel<typeof chartsTable>;
