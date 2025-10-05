import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { validateEnvs } from "../common/validators/env.validation";
import { AdminModule } from "./admin/admin.module";
import { DataModule } from "./data/data.module";
import { DatabaseModule } from "./database/database.module";
import { EmailModule } from "./email/email.module";
import { EncryptionModule } from "./encryption/encryption.module";
import { HealthModule } from "./health/health.module";
import { SimulationModule } from "./simulation/simulation.module";

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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
    EmailModule.forRootAsync(),
    EncryptionModule,
    HealthModule,
    SimulationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
