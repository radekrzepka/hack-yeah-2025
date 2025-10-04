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

  async findRequestById(id: string): Promise<SimulationRequestSelect | null> {
    const [request] = await this.db.client
      .select()
      .from(simulationRequests)
      .where(eq(simulationRequests.id, id));
    return request || null;
  }

  async findResultById(id: string): Promise<SimulationResultSelect | null> {
    const [result] = await this.db.client
      .select()
      .from(simulationResults)
      .where(eq(simulationResults.id, id));
    return result || null;
  }

  async findAllResults(): Promise<Array<SimulationResultSelect>> {
    const results = await this.db.client.select().from(simulationResults);
    return results;
  }

  async findAllRequestsWithResults(): Promise<
    Array<{
      request: SimulationRequestSelect;
      result: SimulationResultSelect | null;
    }>
  > {
    const requests = await this.db.client.select().from(simulationRequests);
    const requestsWithResults = await Promise.all(
      requests.map(async (request) => {
        const result = await this.findResultById(request.id);
        return { request, result };
      }),
    );
    return requestsWithResults;
  }
}
