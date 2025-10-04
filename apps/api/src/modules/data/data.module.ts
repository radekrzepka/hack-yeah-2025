import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { DatabaseModule } from "../database/database.module";
import { DataController } from "./controllers/data.controller";
import { GetLandingPageDataHandler } from "./queries/get-landing-page-data/get-landing-page-data.handler";
import { DataRepository } from "./repositories/data.repository";
import { DataService } from "./services/data.service";

const QueryHandlers = [GetLandingPageDataHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [DataController],
  providers: [DataService, DataRepository, ...QueryHandlers],
  exports: [DataService],
})
export class DataModule {}
