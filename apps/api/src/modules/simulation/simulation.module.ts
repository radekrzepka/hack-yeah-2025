import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateSimulationRequestHandler } from "./commands/create-simulation-request/create-simulation-request.handler";
import { SimulationController } from "./controllers/simulation.controller";
import { GetSimulationResultByIdHandler } from "./queries/get-simulation-result-by-id/get-simulation-result-by-id.handler";
import { SimulationRepository } from "./repositories/simulation.repository";
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
  ],
  exports: [SimulationService, SimulationRepository],
})
export class SimulationModule {}
