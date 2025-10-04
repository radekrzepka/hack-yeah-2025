import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { validateEnvs } from "../common/validators/env.validation";
import { AdminModule } from "./admin/admin.module";
import { DataModule } from "./data/data.module";
import { DatabaseModule } from "./database/database.module";
import { EmailModule } from "./email/email.module";
import { EncryptionModule } from "./encryption/encryption.module";
import { HealthModule } from "./health/health.module";
import { SimulationModule } from "./simulation/simulation.module";
import { TestTableModule } from "./test-table/test-table.module";

@Module({
  imports: [
    DataModule,
    AdminModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvs,
      envFilePath: "../../.env",
    }),
    EmailModule.forRootAsync(),
    EncryptionModule,
    HealthModule,
    SimulationModule,
    TestTableModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
