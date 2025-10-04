import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { GetSimulationResultResponseDto } from "../../dtos/get-simulation-result/get-simulation-result-response.dto";
import { SimulationNotFoundException } from "../../exceptions/simulation.exceptions";
import { SimulationRepository } from "../../repositories/simulation.repository";
import { GetSimulationResultByIdQuery } from "./get-simulation-result-by-id.query";

@QueryHandler(GetSimulationResultByIdQuery)
export class GetSimulationResultByIdHandler
  implements IQueryHandler<GetSimulationResultByIdQuery>
{
  private readonly logger: LoggerService;

  constructor(private readonly simulationRepository: SimulationRepository) {
    this.logger = new LoggerService(GetSimulationResultByIdHandler.name);
  }

  async execute(
    query: GetSimulationResultByIdQuery,
  ): Promise<GetSimulationResultResponseDto> {
    const { id } = query;

    this.logger.log(`Finding simulation result by ID: ${id}`, {
      method: "execute",
    });

    const result = await this.simulationRepository.findResultById(id);

    if (!result) {
      this.logger.logWarning(
        `Simulation result not found with ID: ${id}`,
        "execute",
      );
      throw new SimulationNotFoundException();
    }

    this.logger.log(`Simulation result found with ID: ${id}`, {
      method: "execute",
    });

    return new GetSimulationResultResponseDto(result);
  }
}
