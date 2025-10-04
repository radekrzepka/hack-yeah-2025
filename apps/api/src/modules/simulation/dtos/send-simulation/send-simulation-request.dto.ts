import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export class SendSimulationRequestDto {
  @ApiProperty({
    description: "Age of the person",
    example: 30,
    minimum: 0,
  })
  @IsInt({ message: "Age must be an integer" })
  @Min(0, { message: "Age must be at least 0" })
  @IsNotEmpty({ message: "Age is required" })
  age!: number;

  @ApiProperty({
    description: "Sex of the person",
    enum: SexEnum,
    example: SexEnum.MALE,
  })
  @IsEnum(SexEnum, { message: "Sex must be either 'male' or 'female'" })
  @IsNotEmpty({ message: "Sex is required" })
  sex!: SexEnum;

  @ApiProperty({
    description: "Gross salary amount",
    example: 7500,
    minimum: 0,
  })
  @IsInt({ message: "Gross salary must be an integer" })
  @Min(0, { message: "Gross salary must be at least 0" })
  @IsNotEmpty({ message: "Gross salary is required" })
  grossSalary!: number;

  @ApiProperty({
    description: "Work start date in ISO 8601 format",
    example: "2015-01-01",
    format: "date",
  })
  @IsISO8601(
    { strict: true },
    { message: "Work start date must be a valid ISO 8601 date" },
  )
  @IsNotEmpty({ message: "Work start date is required" })
  workStartDate!: string;

  @ApiProperty({
    description: "Planned retirement year",
    example: 2060,
    minimum: 1900,
  })
  @IsInt({ message: "Planned retirement year must be an integer" })
  @Min(1900, { message: "Planned retirement year must be at least 1900" })
  @IsNotEmpty({ message: "Planned retirement year is required" })
  plannedRetirementYear!: number;

  @ApiProperty({
    description: "Whether to include sick leave in calculation",
    example: true,
  })
  @IsBoolean({ message: "Include sick leave must be a boolean" })
  @IsNotEmpty({ message: "Include sick leave is required" })
  includeSickLeave!: boolean;

  @ApiProperty({
    description: "Expected pension amount",
    example: 5000,
    minimum: 0,
  })
  @IsInt({ message: "Expected pension must be an integer" })
  @Min(0, { message: "Expected pension must be at least 0" })
  @IsNotEmpty({ message: "Expected pension is required" })
  expectedPension!: number;

  @ApiProperty({
    description: "Postal code",
    example: "00-001",
    pattern: "^[0-9]{2}-[0-9]{3}$",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Postal code must be a string" })
  @Matches(/^[0-9]{2}-[0-9]{3}$/, {
    message: "Postal code must be in format XX-XXX",
  })
  postalCode?: string;
}
