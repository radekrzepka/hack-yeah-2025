import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { GetSimulationResultResponseDto } from "../../dtos/get-simulation-result/get-simulation-result-response.dto";
import { SimulationNotFoundException } from "../../exceptions/simulation.exceptions";
import { SimulationRepository } from "../../repositories/simulation.repository";
import { PensionCalculationService } from "../../services/pension-calculation.service";
import { ResponseBuilderService } from "../../services/response-builder.service";
import { GetSimulationResultByIdQuery } from "./get-simulation-result-by-id.query";

@QueryHandler(GetSimulationResultByIdQuery)
export class GetSimulationResultByIdHandler
  implements IQueryHandler<GetSimulationResultByIdQuery>
{
  private readonly logger: LoggerService;

  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly pensionCalculationService: PensionCalculationService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {
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
    const request = await this.simulationRepository.findRequestById(
      String(result.requestId),
    );
    if (!request) {
      this.logger.logWarning(
        `Simulation request not found with ID: ${result.requestId}`,
        "execute",
      );
      throw new SimulationNotFoundException();
    }
    this.logger.log(`Simulation result found with ID: ${id}`, {
      method: "execute",
    });
    const simulationInput = {
      age: request.age,
      sex: request.sex,
      grossSalary: Number(request.grossSalary),
      workStartDate: request.workStartDate,
      plannedRetirementYear: request.plannedRetirementYear,
      includeSickLeave: request.includeSickLeave,
    };
    const calculationResult =
      this.pensionCalculationService.calculatePension(simulationInput);
    const response = this.responseBuilderService.buildResponse({
      id: result.id,
      requestId: String(result.requestId),
      calculationResult,
      simulationInput,
    });
    this.logger.logSuccess(
      `Comprehensive response built for simulation ID: ${id}`,
      "execute",
    );
    return response;
  }
}
