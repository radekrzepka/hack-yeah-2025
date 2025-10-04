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
    this.logger.log("Finding all simulation requests with results", {
      method: "execute",
    });
    const requestsWithResults =
      await this.simulationRepository.findAllRequestsWithResults();
    this.logger.log(
      `Found ${requestsWithResults.length} simulation requests with results`,
      { method: "execute" },
    );
    return requestsWithResults.map(
      (data) => new GetAllSimulationResultsResponseDto(data),
    );
  }
}
