import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({
    description: "Admin login",
    example: "admin",
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    description: "Admin password",
    example: "123",
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
