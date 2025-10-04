import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, jsonb, numeric, pgTable, uuid } from "drizzle-orm/pg-core";

import { simulationRequests } from "./simulation-requests";

export const simulationResults = pgTable("simulation_results", {
  id: uuid().primaryKey().defaultRandom(),
  requestId: uuid()
    .notNull()
    .references(() => simulationRequests.id),
  monthlyPensionGross: numeric({ precision: 10, scale: 2 }).notNull(),
  totalCapital: numeric({ precision: 15, scale: 2 }).notNull(),
  mainAccountCapital: numeric({ precision: 15, scale: 2 }).notNull(),
  subAccountCapital: numeric({ precision: 15, scale: 2 }).notNull(),
  averageLifeExpectancyMonths: numeric({ precision: 6, scale: 2 }).notNull(),
  retirementAge: integer().notNull(),
  yearlyBreakdown: jsonb(),
});

export type SimulationResultSelect = InferSelectModel<typeof simulationResults>;
export type SimulationResultInsert = InferInsertModel<typeof simulationResults>;
