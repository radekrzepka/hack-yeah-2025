import { HttpStatus, Injectable } from "@nestjs/common";

import { DatabaseService } from "../database/services/database.service";
import { HealthCheckResponseDto } from "./dto/health-check-response.dto";

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkHealth(): Promise<HealthCheckResponseDto> {
    const startTime = Date.now();
    const checks = {
      database: false,
      api: true,
    };

    let status: "healthy" | "unhealthy" = "healthy";
    let httpStatus = HttpStatus.OK;

    // Check database connection
    try {
      await this.databaseService.checkConnection();
      checks.database = true;
    } catch {
      checks.database = false;
      status = "unhealthy";
      httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
    }

    const responseTime = Date.now() - startTime;

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "development",
      checks,
      httpStatus,
    };
  }
}
