import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

import { EmailTransform } from "../../../../common/decorators/email-transform.decorator";

export class UpdateTestTableRequestDto {
  @ApiProperty({
    description: `Valid email address (1-${MAX_EMAIL_LENGTH} characters)`,
    maxLength: MAX_EMAIL_LENGTH,
    format: "email",
    example: "user@example.com",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @EmailTransform()
  @MaxLength(MAX_EMAIL_LENGTH)
  email?: string;

  @ApiProperty({
    description: `First name (1-${MAX_NAME_LENGTH} characters)`,
    maxLength: MAX_NAME_LENGTH,
    example: "John",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "First name must be a string" })
  @MaxLength(MAX_NAME_LENGTH, {
    message: `First name cannot exceed ${MAX_NAME_LENGTH} characters`,
  })
  firstName?: string;
}
