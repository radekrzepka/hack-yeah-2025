import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { SendSimulationResponseDto } from "../../dtos/send-simulation/send-simulation-response.dto";
import { SimulationCreationException } from "../../exceptions/simulation.exceptions";
import { SimulationRepository } from "../../repositories/simulation.repository";
import { CreateSimulationRequestCommand } from "./create-simulation-request.command";

@CommandHandler(CreateSimulationRequestCommand)
export class CreateSimulationRequestHandler
  implements ICommandHandler<CreateSimulationRequestCommand>
{
  private readonly logger: LoggerService;

  constructor(private readonly simulationRepository: SimulationRepository) {
    this.logger = new LoggerService(CreateSimulationRequestHandler.name);
  }

  async execute(
    command: CreateSimulationRequestCommand,
  ): Promise<SendSimulationResponseDto> {
    const {
      age,
      sex,
      grossSalary,
      workStartDate,
      plannedRetirementYear,
      includeSickLeave,
    } = command;

    this.logger.logCommandStart("CreateSimulationRequestCommand", "execute", {
      age,
      sex,
      grossSalary,
      workStartDate,
      plannedRetirementYear,
      includeSickLeave,
    });

    const createdRequest = await this.simulationRepository.create({
      age,
      sex,
      grossSalary,
      workStartDate,
      plannedRetirementYear,
      includeSickLeave,
    });

    if (!createdRequest) {
      this.logger.logFailure(
        "Simulation request creation failed",
        new Error("Request creation failed"),
        "execute",
      );
      throw new SimulationCreationException();
    }

    this.logger.logSuccess(
      `Simulation request created successfully with ID: ${createdRequest.id}`,
      "execute",
    );

    const randomTestValue = Math.floor(Math.random() * 10000);
    const createdResult = await this.simulationRepository.createResult({
      id: createdRequest.id,
      test: randomTestValue,
    });

    if (!createdResult) {
      this.logger.logFailure(
        "Simulation result creation failed",
        new Error("Result creation failed"),
        "execute",
      );
      throw new SimulationCreationException();
    }

    this.logger.logSuccess(
      `Simulation result created successfully with ID: ${createdResult.id} and test value: ${randomTestValue}`,
      "execute",
    );

    return new SendSimulationResponseDto(createdRequest);
  }
}
