import type {
  SimulationRequestInsert,
  SimulationRequestSelect,
  SimulationResultInsert,
  SimulationResultSelect,
} from "@hackathon/db";

export interface ISimulationRepository {
  create(
    simulationRequest: SimulationRequestInsert,
  ): Promise<SimulationRequestSelect | null>;
  createResult(
    simulationResult: SimulationResultInsert,
  ): Promise<SimulationResultSelect | null>;
  findResultById(id: string): Promise<SimulationResultSelect | null>;
}
