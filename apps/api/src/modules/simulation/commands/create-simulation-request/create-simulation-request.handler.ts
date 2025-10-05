import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { SendSimulationResponseDto } from "../../dtos/send-simulation/send-simulation-response.dto";
import { SimulationCreationException } from "../../exceptions/simulation.exceptions";
import { SimulationRepository } from "../../repositories/simulation.repository";
import { PensionCalculationService } from "../../services/pension-calculation.service";
import { ResponseBuilderService } from "../../services/response-builder.service";
import { CreateSimulationRequestCommand } from "./create-simulation-request.command";

@CommandHandler(CreateSimulationRequestCommand)
export class CreateSimulationRequestHandler
  implements ICommandHandler<CreateSimulationRequestCommand>
{
  private readonly logger: LoggerService;

  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly pensionCalculationService: PensionCalculationService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {
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
      expectedPension,
      postalCode,
      contractType,
      currentFunds,
      includeWageGrowth,
      includeIndexation,
      customExperience,
    } = command;

    this.logger.logCommandStart("CreateSimulationRequestCommand", "execute", {
      age,
      sex,
      grossSalary,
      workStartDate,
      plannedRetirementYear,
      includeSickLeave,
      expectedPension,
      postalCode,
      contractType,
      currentFunds,
      includeWageGrowth,
      includeIndexation,
      customExperience,
    });

    const createdRequest = await this.simulationRepository.create({
      age,
      sex,
      grossSalary,
      workStartDate,
      plannedRetirementYear,
      includeSickLeave,
      expectedPension,
      postalCode,
      additionalData: {
        contractType,
        currentFunds,
        includeWageGrowth,
        includeIndexation,
        customExperience,
      },
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

    const calculationResult =
      await this.pensionCalculationService.calculatePension({
        age,
        sex,
        grossSalary,
        workStartDate,
        plannedRetirementYear,
        includeSickLeave,
        contractType,
        currentFunds,
        includeWageGrowth,
        includeIndexation,
        postalCode,
        customExperience,
      });

    const createdResult = await this.simulationRepository.createResult({
      id: createdRequest.id,
      requestId: createdRequest.id,
      monthlyPensionGross: calculationResult.monthlyPensionGross.toFixed(2),
      totalCapital: calculationResult.totalCapital.toFixed(2),
      mainAccountCapital: calculationResult.mainAccountCapital.toFixed(2),
      subAccountCapital: calculationResult.subAccountCapital.toFixed(2),
      averageLifeExpectancyMonths:
        calculationResult.averageLifeExpectancyMonths.toFixed(2),
      retirementAge: calculationResult.retirementAge,
      yearlyBreakdown: calculationResult.yearlyBreakdown,
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
      `Simulation result created successfully with ID: ${createdResult.id}, monthly pension: ${calculationResult.monthlyPensionGross.toFixed(2)} PLN`,
      "execute",
    );

    return new SendSimulationResponseDto(createdRequest);
  }
}
