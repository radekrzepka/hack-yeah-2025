import { SimulationRequestSelect } from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

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

interface AdditionalData {
  contractType: ContractTypeEnum;
  currentFunds?: number;
  includeWageGrowth: boolean;
  includeIndexation: boolean;
}

export class SendSimulationResponseDto {
  @ApiProperty({
    description: "Unique simulation request identifier (token)",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Age of the person",
    example: 30,
  })
  age: number;

  @ApiProperty({
    description: "Sex of the person",
    enum: SexEnum,
    example: SexEnum.MALE,
  })
  sex: SexEnum;

  @ApiProperty({
    description: "Gross salary amount",
    example: 7500,
  })
  grossSalary: number;

  @ApiProperty({
    description: "Work start date in ISO 8601 format",
    example: "2015-01-01",
    format: "date",
  })
  workStartDate: string;

  @ApiProperty({
    description: "Planned retirement year",
    example: 2060,
  })
  plannedRetirementYear: number;

  @ApiProperty({
    description: "Whether to include sick leave in calculation",
    example: true,
  })
  includeSickLeave: boolean;

  @ApiProperty({
    description: "Expected pension amount",
    example: 5000,
  })
  expectedPension: number;

  @ApiProperty({
    description: "Postal code",
    example: "00-001",
    required: false,
  })
  postalCode?: string | null;

  @ApiProperty({
    description: "Contract type",
    enum: ContractTypeEnum,
    example: ContractTypeEnum.UOP,
  })
  contractType: ContractTypeEnum;

  @ApiProperty({
    description: "Current ZUS funds amount",
    example: 150000,
    required: false,
  })
  currentFunds?: number;

  @ApiProperty({
    description: "Whether to include wage growth projection",
    example: true,
  })
  includeWageGrowth: boolean;

  @ApiProperty({
    description: "Whether to include benefit indexation",
    example: true,
  })
  includeIndexation: boolean;

  constructor(simulationRequest: SimulationRequestSelect) {
    const additionalData =
      simulationRequest.additionalData as AdditionalData | null;

    this.id = simulationRequest.id;
    this.age = simulationRequest.age;
    this.sex = simulationRequest.sex as SexEnum;
    this.grossSalary = simulationRequest.grossSalary;
    this.workStartDate = simulationRequest.workStartDate;
    this.plannedRetirementYear = simulationRequest.plannedRetirementYear;
    this.includeSickLeave = simulationRequest.includeSickLeave;
    this.expectedPension = simulationRequest.expectedPension;
    this.postalCode = simulationRequest.postalCode;
    this.contractType = additionalData?.contractType ?? ContractTypeEnum.UOP;
    this.currentFunds = additionalData?.currentFunds;
    this.includeWageGrowth = additionalData?.includeWageGrowth ?? false;
    this.includeIndexation = additionalData?.includeIndexation ?? false;
  }
}
