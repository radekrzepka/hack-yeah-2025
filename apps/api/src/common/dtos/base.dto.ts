import { ApiProperty } from "@nestjs/swagger";

export class BaseDto {
  @ApiProperty({
    description: "A message describing the result of the operation",
    type: String,
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
