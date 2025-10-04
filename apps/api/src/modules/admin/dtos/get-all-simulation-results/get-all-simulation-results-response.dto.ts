import type {
  SimulationRequestSelect,
  SimulationResultSelect,
} from "@hackathon/db";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllSimulationResultsResponseDto {
  @ApiProperty({
    description: "Simulation request ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Date of use (creation date)",
    example: "2024-10-04",
  })
  usageDate: string;

  @ApiProperty({
    description: "Time of use (creation time)",
    example: "14:30:00",
  })
  usageTime: string;

  @ApiProperty({
    description: "Expected pension amount",
    example: 5000,
  })
  expectedPension: number;

  @ApiProperty({
    description: "Age of the person",
    example: 30,
  })
  age: number;

  @ApiProperty({
    description: "Sex of the person",
    example: "male",
  })
  sex: string;

  @ApiProperty({
    description: "Gross salary amount",
    example: 7500,
  })
  grossSalary: number;

  @ApiProperty({
    description: "Whether sick leave was included in calculation",
    example: true,
  })
  includeSickLeave: boolean;

  @ApiProperty({
    description: "Total capital accumulated (main account + sub account)",
    example: "450000.00",
    nullable: true,
  })
  totalCapital: string | null;

  @ApiProperty({
    description: "Main account capital",
    example: "300000.00",
    nullable: true,
  })
  mainAccountCapital: string | null;

  @ApiProperty({
    description: "Sub account capital",
    example: "150000.00",
    nullable: true,
  })
  subAccountCapital: string | null;

  @ApiProperty({
    description: "Actual monthly pension (gross)",
    example: "3500.00",
    nullable: true,
  })
  actualPension: string | null;

  @ApiProperty({
    description: "Adjusted pension (monthly pension gross)",
    example: "3500.00",
    nullable: true,
  })
  adjustedPension: string | null;

  @ApiProperty({
    description: "Postal code",
    example: "00-001",
    nullable: true,
  })
  postalCode: string | null;

  constructor({
    request,
    result,
  }: {
    request: SimulationRequestSelect;
    result: SimulationResultSelect | null;
  }) {
    this.id = request.id;
    const createdAt = new Date(request.createdAt);
    this.usageDate = createdAt.toISOString().split("T")[0] || "";
    this.usageTime = createdAt.toTimeString().split(" ")[0] || "";
    this.expectedPension = request.expectedPension;
    this.age = request.age;
    this.sex = request.sex;
    this.grossSalary = request.grossSalary;
    this.includeSickLeave = request.includeSickLeave;
    this.totalCapital = result?.totalCapital || null;
    this.mainAccountCapital = result?.mainAccountCapital || null;
    this.subAccountCapital = result?.subAccountCapital || null;
    this.actualPension = result?.monthlyPensionGross || null;
    this.adjustedPension = result?.monthlyPensionGross || null;
    this.postalCode = request.postalCode || null;
  }
}
