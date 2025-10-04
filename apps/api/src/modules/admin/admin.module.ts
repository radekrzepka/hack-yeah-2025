import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { EncryptionModule } from "../encryption/encryption.module";
import { SimulationModule } from "../simulation/simulation.module";
import { LoginHandler } from "./commands/login/login.handler";
import { AdminController } from "./controllers/admin.controller";
import { GetAllSimulationResultsHandler } from "./queries/get-all-simulation-results/get-all-simulation-results.handler";
import { AdminRepository } from "./repositories/admin.repository";
import { AdminService } from "./services/admin.service";

const AdminCommandHandlers = [LoginHandler];

const AdminQueryHandlers = [GetAllSimulationResultsHandler];

@Module({
  imports: [CqrsModule, EncryptionModule, SimulationModule],
  controllers: [AdminController],
  providers: [
    ...AdminCommandHandlers,
    ...AdminQueryHandlers,
    AdminService,
    AdminRepository,
  ],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
