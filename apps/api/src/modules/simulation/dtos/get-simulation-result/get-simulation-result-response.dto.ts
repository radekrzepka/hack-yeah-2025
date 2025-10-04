import { SimulationResultSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class GetSimulationResultResponseDto {
  @ApiProperty({
    description: "Simulation token ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Test value generated for simulation",
    example: 5432,
  })
  test: number;

  constructor(simulationResult: SimulationResultSelect) {
    this.id = simulationResult.id;
    this.test = simulationResult.test;
  }
}
