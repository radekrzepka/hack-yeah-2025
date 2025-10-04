import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { HealthCheckResponseDto } from "./dto/health-check-response.dto";
import { HealthService } from "./health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: "Health check endpoint",
    description:
      "Returns the current health status of the API and its dependencies",
  })
  @ApiResponse({
    status: 200,
    description: "API is healthy",
    type: HealthCheckResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: "API is unhealthy",
    type: HealthCheckResponseDto,
  })
  async getHealth(): Promise<HealthCheckResponseDto> {
    return this.healthService.checkHealth();
  }
}
