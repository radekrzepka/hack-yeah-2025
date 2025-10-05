import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum ContractTypeEnum {
  UOP = "uop",
  B2B = "b2b",
  ZLECENIE = "zlecenie",
  DZIELO = "dzielo",
}

export class CustomExperiencePeriodDto {
  @ApiProperty({
    description: "Year when the custom experience period starts",
    example: 2025,
    minimum: 1900,
  })
  @IsInt({ message: "Year start must be an integer" })
  @Min(1900, { message: "Year start must be at least 1900" })
  @IsNotEmpty({ message: "Year start is required" })
  yearStart!: number;

  @ApiProperty({
    description: "Year when the custom experience period ends",
    example: 2026,
    minimum: 1900,
  })
  @IsInt({ message: "Year end must be an integer" })
  @Min(1900, { message: "Year end must be at least 1900" })
  @IsNotEmpty({ message: "Year end is required" })
  yearEnd!: number;

  @ApiProperty({
    description: "Monthly salary for this period",
    example: 5000,
    minimum: 0,
  })
  @IsInt({ message: "Monthly salary must be an integer" })
  @Min(0, { message: "Monthly salary must be at least 0" })
  @IsNotEmpty({ message: "Monthly salary is required" })
  monthlySalary!: number;

  @ApiProperty({
    description: "Contract type for this period",
    enum: ContractTypeEnum,
    example: ContractTypeEnum.UOP,
  })
  @IsEnum(ContractTypeEnum, { message: "Contract type must be a valid type" })
  @IsNotEmpty({ message: "Contract type is required" })
  contractType!: ContractTypeEnum;
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

  @ApiProperty({
    description: "Contract type",
    enum: ContractTypeEnum,
    example: ContractTypeEnum.UOP,
  })
  @IsEnum(ContractTypeEnum, { message: "Contract type must be a valid type" })
  @IsNotEmpty({ message: "Contract type is required" })
  contractType!: ContractTypeEnum;

  @ApiProperty({
    description: "Current ZUS funds amount",
    example: 150000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: "Current funds must be an integer" })
  @Min(0, { message: "Current funds must be at least 0" })
  currentFunds?: number;

  @ApiProperty({
    description: "Whether to include wage growth projection",
    example: true,
  })
  @IsBoolean({ message: "Include wage growth must be a boolean" })
  @IsNotEmpty({ message: "Include wage growth is required" })
  includeWageGrowth!: boolean;

  @ApiProperty({
    description: "Whether to include benefit indexation",
    example: true,
  })
  @IsBoolean({ message: "Include indexation must be a boolean" })
  @IsNotEmpty({ message: "Include indexation is required" })
  includeIndexation!: boolean;

  @ApiProperty({
    description:
      "Custom experience periods with specific salaries and contract types",
    type: [CustomExperiencePeriodDto],
    required: false,
    example: [
      {
        yearStart: 2025,
        yearEnd: 2026,
        monthlySalary: 5000,
        contractType: "uop",
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: "Custom experience must be an array" })
  @ValidateNested({ each: true })
  @Type(() => CustomExperiencePeriodDto)
  customExperience?: Array<CustomExperiencePeriodDto>;
}
