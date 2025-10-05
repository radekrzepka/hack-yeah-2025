import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateSimulationRequestHandler } from "./commands/create-simulation-request/create-simulation-request.handler";
import { SimulationController } from "./controllers/simulation.controller";
import { GetSimulationResultByIdHandler } from "./queries/get-simulation-result-by-id/get-simulation-result-by-id.handler";
import { SimulationRepository } from "./repositories/simulation.repository";
import { DataProviderService } from "./services/data-provider.service";
import { ImprovementScenariosService } from "./services/improvement-scenarios.service";
import { PensionCalculationService } from "./services/pension-calculation.service";
import { PostalCodeApiService } from "./services/postal-code-api.service";
import { ResponseBuilderService } from "./services/response-builder.service";
import { SimulationService } from "./services/simulation.service";

const SimulationCommandHandlers = [CreateSimulationRequestHandler];

const SimulationQueryHandlers = [GetSimulationResultByIdHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SimulationController],
  providers: [
    ...SimulationCommandHandlers,
    ...SimulationQueryHandlers,
    SimulationService,
    SimulationRepository,
    DataProviderService,
    PostalCodeApiService,
    PensionCalculationService,
    ImprovementScenariosService,
    ResponseBuilderService,
  ],
  exports: [SimulationService, SimulationRepository],
})
export class SimulationModule { }
