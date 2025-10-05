import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateSimulationRequestCommand } from "../commands/create-simulation-request/create-simulation-request.command";
import { GetSimulationResultResponseDto } from "../dtos/get-simulation-result/get-simulation-result-response.dto";
import { SendSimulationRequestDto } from "../dtos/send-simulation/send-simulation-request.dto";
import { SendSimulationResponseDto } from "../dtos/send-simulation/send-simulation-response.dto";
import { GetSimulationResultByIdQuery } from "../queries/get-simulation-result-by-id/get-simulation-result-by-id.query";

@Injectable()
export class SimulationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async sendSimulation(
    dto: SendSimulationRequestDto,
  ): Promise<SendSimulationResponseDto> {
    const command = new CreateSimulationRequestCommand(
      dto.age,
      dto.sex,
      dto.grossSalary,
      dto.workStartDate,
      dto.plannedRetirementYear,
      dto.includeSickLeave,
      dto.expectedPension,
      dto.postalCode,
      dto.contractType,
      dto.currentFunds,
      dto.includeWageGrowth,
      dto.includeIndexation,
      dto.customExperience,
    );
    return this.commandBus.execute(command);
  }

  async getSimulationResult(
    id: string,
  ): Promise<GetSimulationResultResponseDto> {
    const query = new GetSimulationResultByIdQuery(id);
    return this.queryBus.execute(query);
  }
}
