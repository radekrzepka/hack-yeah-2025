import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sex", ["male", "female"]);

export const simulationRequests = pgTable("simulation_requests", {
  id: uuid().primaryKey().defaultRandom(),
  age: integer().notNull(),
  sex: sexEnum().notNull(),
  grossSalary: integer().notNull(),
  workStartDate: date().notNull(),
  plannedRetirementYear: integer().notNull(),
  includeSickLeave: boolean().notNull().default(false),
  expectedPension: integer().notNull(),
  postalCode: varchar({ length: 10 }),
  createdAt: timestamp().notNull().defaultNow(),
  additionalData: jsonb(),
});

export type SimulationRequestSelect = InferSelectModel<
  typeof simulationRequests
>;
export type SimulationRequestInsert = InferInsertModel<
  typeof simulationRequests
>;
