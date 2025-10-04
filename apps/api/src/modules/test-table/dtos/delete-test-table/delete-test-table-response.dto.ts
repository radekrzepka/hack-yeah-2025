import { ApiProperty } from "@nestjs/swagger";

export class DeleteTestTableResponseDto {
  @ApiProperty({
    description: "Whether the deletion was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Success message",
    example: "Test table record deleted successfully",
  })
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
