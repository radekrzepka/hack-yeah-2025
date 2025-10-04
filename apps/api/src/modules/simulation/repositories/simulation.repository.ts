import {
  SimulationRequestInsert,
  simulationRequests,
  SimulationRequestSelect,
  SimulationResultInsert,
  simulationResults,
  SimulationResultSelect,
} from "@hackathon/db";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabaseService } from "../../database/services/database.service";
import { ISimulationRepository } from "./simulation.repository.interface";

@Injectable()
export class SimulationRepository implements ISimulationRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(
    data: SimulationRequestInsert,
  ): Promise<SimulationRequestSelect | null> {
    const [createdRequest] = await this.db.client
      .insert(simulationRequests)
      .values(data)
      .returning();
    return createdRequest || null;
  }

  async createResult(
    data: SimulationResultInsert,
  ): Promise<SimulationResultSelect | null> {
    const [createdResult] = await this.db.client
      .insert(simulationResults)
      .values(data)
      .returning();
    return createdResult || null;
  }

  async findResultById(id: string): Promise<SimulationResultSelect | null> {
    const [result] = await this.db.client
      .select()
      .from(simulationResults)
      .where(eq(simulationResults.id, id));
    return result || null;
  }
}
