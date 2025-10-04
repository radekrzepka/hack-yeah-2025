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
  findRequestById(id: string): Promise<SimulationRequestSelect | null>;
  findResultById(id: string): Promise<SimulationResultSelect | null>;
  findAllResults(): Promise<Array<SimulationResultSelect>>;
  findAllRequestsWithResults(): Promise<
    Array<{
      request: SimulationRequestSelect;
      result: SimulationResultSelect | null;
    }>
  >;
}
