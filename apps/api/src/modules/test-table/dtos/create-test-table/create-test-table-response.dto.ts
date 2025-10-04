import { TestTableSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTestTableResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Email address",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "First name",
    example: "John",
  })
  firstName: string;

  constructor(testTable: TestTableSelect) {
    this.id = testTable.id;
    this.email = testTable.email;
    this.firstName = testTable.firstName;
  }
}
