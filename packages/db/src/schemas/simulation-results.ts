import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";

export const simulationResults = pgTable("simulation_results", {
  id: uuid().primaryKey().defaultRandom(),
  test: integer().notNull(),
});

export type SimulationResultSelect = InferSelectModel<typeof simulationResults>;
export type SimulationResultInsert = InferInsertModel<typeof simulationResults>;
