import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { SimulationRepository } from "../../../simulation/repositories/simulation.repository";
import { GetAllSimulationResultsResponseDto } from "../../dtos/get-all-simulation-results/get-all-simulation-results-response.dto";
import { GetAllSimulationResultsQuery } from "./get-all-simulation-results.query";

@QueryHandler(GetAllSimulationResultsQuery)
export class GetAllSimulationResultsHandler
  implements IQueryHandler<GetAllSimulationResultsQuery>
{
  private readonly logger: LoggerService;

  constructor(private readonly simulationRepository: SimulationRepository) {
    this.logger = new LoggerService(GetAllSimulationResultsHandler.name);
  }

  async execute(): Promise<Array<GetAllSimulationResultsResponseDto>> {
    this.logger.log("Finding all simulation results", { method: "execute" });
    const results = await this.simulationRepository.findAllResults();
    this.logger.log(`Found ${results.length} simulation results`, {
      method: "execute",
    });
    return results.map(
      (result) => new GetAllSimulationResultsResponseDto(result),
    );
  }
}
