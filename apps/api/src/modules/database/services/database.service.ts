import * as schema from "@hackathon/db";
import { Inject, Injectable } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { CONNECTION_POOL } from "../../../common/constants";
import { CustomDrizzleLogger } from "./custom-drizzle-logger";

@Injectable()
export class DatabaseService {
  public client: NodePgDatabase<typeof schema>;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.client = drizzle(this.pool, {
      schema: schema,
      logger: new CustomDrizzleLogger(),
    });
  }

  async checkConnection(): Promise<void> {
    try {
      await this.pool.query("SELECT 1");
    } catch (error) {
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
