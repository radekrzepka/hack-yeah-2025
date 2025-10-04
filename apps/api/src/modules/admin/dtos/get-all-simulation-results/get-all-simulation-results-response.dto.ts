import type { SimulationResultSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllSimulationResultsResponseDto {
  @ApiProperty({
    description: "Simulation result ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Test value",
    example: 42,
  })
  test: number;

  constructor(result: SimulationResultSelect) {
    this.id = result.id;
    this.test = result.test;
  }
}
