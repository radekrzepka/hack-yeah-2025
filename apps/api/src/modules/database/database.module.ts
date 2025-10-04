import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

import { CONNECTION_POOL } from "../../common/constants";
import { DatabaseService } from "./services/database.service";

@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>("DATABASE_URL");
        return new Pool({
          connectionString,
        });
      },
    },
  ],
})
export class DatabaseModule {}
