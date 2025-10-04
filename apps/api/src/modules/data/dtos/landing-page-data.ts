import { FactsTableSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFactTableResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Fact",
    example: "Czy wiedziałeś, że ZUS powstał w 1934 roku.",
  })
  fact: string;

  constructor(factsTable: FactsTableSelect) {
    this.id = factsTable.id;
    this.fact = factsTable.fact;
  }
}
