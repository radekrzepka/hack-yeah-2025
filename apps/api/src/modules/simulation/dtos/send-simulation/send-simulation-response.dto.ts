import { SimulationRequestSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class SendSimulationResponseDto {
  @ApiProperty({
    description: "Unique simulation request identifier (token)",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  constructor(simulationRequest: SimulationRequestSelect) {
    this.id = simulationRequest.id;
  }
}
