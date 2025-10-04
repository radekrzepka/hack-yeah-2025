import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckResponseDto {
  @ApiProperty({
    description: "Overall health status",
    enum: ["healthy", "unhealthy"],
    example: "healthy",
  })
  status!: "healthy" | "unhealthy";

  @ApiProperty({
    description: "ISO timestamp of the health check",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp!: string;

  @ApiProperty({
    description: "Application uptime in seconds",
    example: 3600,
  })
  uptime!: number;

  @ApiProperty({
    description: "Health check response time in milliseconds",
    example: 25,
  })
  responseTime!: number;

  @ApiProperty({
    description: "Application version",
    example: "1.0.0",
  })
  version!: string;

  @ApiProperty({
    description: "Current environment",
    example: "production",
  })
  environment!: string;

  @ApiProperty({
    description: "Individual service checks",
    example: {
      database: true,
      api: true,
    },
  })
  checks!: {
    database: boolean;
    api: boolean;
  };

  @ApiProperty({
    description: "HTTP status code",
    example: 200,
  })
  httpStatus!: number;
}
