import { ApiProperty } from "@nestjs/swagger";

export class PensionSummaryDto {
  @ApiProperty({
    description: "Projected monthly pension in PLN",
    example: 3456.78,
  })
  projectedPension: number;

  @ApiProperty({
    description: "Current average salary (last salary used in calculation)",
    example: 8000.0,
  })
  currentSalary: number;

  @ApiProperty({
    description:
      "Replacement rate - ratio of pension to last salary (as percentage)",
    example: 43.21,
  })
  replacementRate: number;

  @ApiProperty({
    description: "Years until retirement",
    example: 32,
  })
  yearsToRetirement: number;

  @ApiProperty({
    description: "Total accumulated capital in PLN",
    example: 750000.0,
  })
  totalCapital: number;

  @ApiProperty({
    description: "Retirement age",
    example: 65,
  })
  retirementAge: number;

  constructor(data: PensionSummaryDto) {
    this.projectedPension = data.projectedPension;
    this.currentSalary = data.currentSalary;
    this.replacementRate = data.replacementRate;
    this.yearsToRetirement = data.yearsToRetirement;
    this.totalCapital = data.totalCapital;
    this.retirementAge = data.retirementAge;
  }
}

export class AccumulationChartDataDto {
  @ApiProperty({ description: "Year", example: 2024 })
  year: number;

  @ApiProperty({ description: "Age in this year", example: 35 })
  age: number;

  @ApiProperty({ description: "Total balance", example: 192500.0 })
  totalBalance: number;

  @ApiProperty({ description: "Main account balance", example: 150000.0 })
  mainAccountBalance: number;

  @ApiProperty({ description: "Sub account balance", example: 42500.0 })
  subAccountBalance: number;

  @ApiProperty({ description: "Yearly salary", example: 90000.0 })
  yearlySalary: number;

  constructor(data: AccumulationChartDataDto) {
    this.year = data.year;
    this.age = data.age;
    this.totalBalance = data.totalBalance;
    this.mainAccountBalance = data.mainAccountBalance;
    this.subAccountBalance = data.subAccountBalance;
    this.yearlySalary = data.yearlySalary;
  }
}

export class AccountBreakdownDto {
  @ApiProperty({
    description: "Main account capital in PLN",
    example: 580000.0,
  })
  mainAccountCapital: number;

  @ApiProperty({
    description: "Main account percentage",
    example: 77.33,
  })
  mainAccountPercentage: number;

  @ApiProperty({
    description: "Sub account capital in PLN",
    example: 170000.0,
  })
  subAccountCapital: number;

  @ApiProperty({
    description: "Sub account percentage",
    example: 22.67,
  })
  subAccountPercentage: number;

  @ApiProperty({
    description: "Total capital in PLN",
    example: 750000.0,
  })
  totalCapital: number;

  constructor(data: AccountBreakdownDto) {
    this.mainAccountCapital = data.mainAccountCapital;
    this.mainAccountPercentage = data.mainAccountPercentage;
    this.subAccountCapital = data.subAccountCapital;
    this.subAccountPercentage = data.subAccountPercentage;
    this.totalCapital = data.totalCapital;
  }
}

export class ContributionVsGrowthDto {
  @ApiProperty({
    description: "Total contributions made over career",
    example: 500000.0,
  })
  totalContributions: number;

  @ApiProperty({
    description: "Growth from valorization",
    example: 250000.0,
  })
  valorizationGrowth: number;

  @ApiProperty({
    description: "Total capital",
    example: 750000.0,
  })
  totalCapital: number;

  @ApiProperty({
    description: "Contribution percentage",
    example: 66.67,
  })
  contributionPercentage: number;

  @ApiProperty({
    description: "Valorization percentage",
    example: 33.33,
  })
  valorizationPercentage: number;

  constructor(data: ContributionVsGrowthDto) {
    this.totalContributions = data.totalContributions;
    this.valorizationGrowth = data.valorizationGrowth;
    this.totalCapital = data.totalCapital;
    this.contributionPercentage = data.contributionPercentage;
    this.valorizationPercentage = data.valorizationPercentage;
  }
}

export class DecadeSummaryDto {
  @ApiProperty({ description: "Decade label", example: "2020-2029" })
  decade: string;

  @ApiProperty({ description: "Age range", example: "30-39" })
  ageRange: string;

  @ApiProperty({
    description: "Average yearly contribution",
    example: 15000.0,
  })
  averageYearlyContribution: number;

  @ApiProperty({
    description: "Balance at end of decade",
    example: 180000.0,
  })
  balanceAtEnd: number;

  @ApiProperty({
    description: "Growth in this decade",
    example: 150000.0,
  })
  growthInDecade: number;

  constructor(data: DecadeSummaryDto) {
    this.decade = data.decade;
    this.ageRange = data.ageRange;
    this.averageYearlyContribution = data.averageYearlyContribution;
    this.balanceAtEnd = data.balanceAtEnd;
    this.growthInDecade = data.growthInDecade;
  }
}

export class PensionChartsDto {
  @ApiProperty({
    description: "Pension accumulation over time (for line chart)",
    type: [AccumulationChartDataDto],
  })
  accumulationOverTime: Array<AccumulationChartDataDto>;

  @ApiProperty({
    description: "Account breakdown (for pie/donut chart)",
    type: AccountBreakdownDto,
  })
  accountBreakdown: AccountBreakdownDto;

  @ApiProperty({
    description: "Contribution vs Capital growth (for comparison chart)",
    type: ContributionVsGrowthDto,
  })
  contributionVsGrowth: ContributionVsGrowthDto;

  @ApiProperty({
    description: "Decade-by-decade summary (for bar chart)",
    type: [DecadeSummaryDto],
  })
  decadeSummary: Array<DecadeSummaryDto>;

  constructor(data: PensionChartsDto) {
    this.accumulationOverTime = data.accumulationOverTime.map(
      (item) => new AccumulationChartDataDto(item),
    );
    this.accountBreakdown = new AccountBreakdownDto(data.accountBreakdown);
    this.contributionVsGrowth = new ContributionVsGrowthDto(
      data.contributionVsGrowth,
    );
    this.decadeSummary = data.decadeSummary.map(
      (item) => new DecadeSummaryDto(item),
    );
  }
}

export class SalaryIncreaseOptionDto {
  @ApiProperty({ description: "Percentage increase", example: 10 })
  increasePercentage: number;

  @ApiProperty({
    description: "New monthly salary needed",
    example: 8800.0,
  })
  newMonthlySalary: number;

  @ApiProperty({ description: "Salary difference", example: 800.0 })
  salaryDifference: number;

  @ApiProperty({
    description: "New projected pension",
    example: 3802.46,
  })
  newPension: number;

  @ApiProperty({ description: "Pension improvement", example: 345.68 })
  pensionImprovement: number;

  @ApiProperty({
    description: "Improvement percentage",
    example: 10.0,
  })
  improvementPercentage: number;

  constructor(data: SalaryIncreaseOptionDto) {
    this.increasePercentage = data.increasePercentage;
    this.newMonthlySalary = data.newMonthlySalary;
    this.salaryDifference = data.salaryDifference;
    this.newPension = data.newPension;
    this.pensionImprovement = data.pensionImprovement;
    this.improvementPercentage = data.improvementPercentage;
  }
}

export class SalaryIncreaseScenarioDto {
  @ApiProperty({
    description: "Current monthly pension",
    example: 3456.78,
  })
  currentPension: number;

  @ApiProperty({
    description: "Three options for salary increase",
    type: [SalaryIncreaseOptionDto],
  })
  options: Array<SalaryIncreaseOptionDto>;

  constructor(data: SalaryIncreaseScenarioDto) {
    this.currentPension = data.currentPension;
    this.options = data.options.map((opt) => new SalaryIncreaseOptionDto(opt));
  }
}

export class WorkLongerOptionDto {
  @ApiProperty({ description: "Additional years to work", example: 1 })
  additionalYears: number;

  @ApiProperty({ description: "New retirement age", example: 66 })
  newRetirementAge: number;

  @ApiProperty({ description: "New retirement year", example: 2058 })
  newRetirementYear: number;

  @ApiProperty({
    description: "New projected pension",
    example: 3890.23,
  })
  newPension: number;

  @ApiProperty({ description: "Pension improvement", example: 433.45 })
  pensionImprovement: number;

  @ApiProperty({
    description: "Improvement percentage",
    example: 12.54,
  })
  improvementPercentage: number;

  constructor(data: WorkLongerOptionDto) {
    this.additionalYears = data.additionalYears;
    this.newRetirementAge = data.newRetirementAge;
    this.newRetirementYear = data.newRetirementYear;
    this.newPension = data.newPension;
    this.pensionImprovement = data.pensionImprovement;
    this.improvementPercentage = data.improvementPercentage;
  }
}

export class WorkLongerScenarioDto {
  @ApiProperty({
    description: "Current monthly pension",
    example: 3456.78,
  })
  currentPension: number;

  @ApiProperty({
    description: "Three options for working longer",
    type: [WorkLongerOptionDto],
  })
  options: Array<WorkLongerOptionDto>;

  constructor(data: WorkLongerScenarioDto) {
    this.currentPension = data.currentPension;
    this.options = data.options.map((opt) => new WorkLongerOptionDto(opt));
  }
}

export class FewerSickDaysOptionDto {
  @ApiProperty({
    description: "Description of the scenario",
    example: "No sick leave",
  })
  scenario: string;

  @ApiProperty({
    description: "Sick days reduction percentage",
    example: 100,
  })
  reductionPercentage: number;

  @ApiProperty({
    description: "New projected pension",
    example: 3650.12,
  })
  newPension: number;

  @ApiProperty({ description: "Pension improvement", example: 193.34 })
  pensionImprovement: number;

  @ApiProperty({
    description: "Improvement percentage",
    example: 5.59,
  })
  improvementPercentage: number;

  @ApiProperty({
    description: "Average sick days per year currently",
    example: 10,
  })
  currentAverageSickDays: number;

  @ApiProperty({
    description: "New average sick days per year",
    example: 0,
  })
  newAverageSickDays: number;

  constructor(data: FewerSickDaysOptionDto) {
    this.scenario = data.scenario;
    this.reductionPercentage = data.reductionPercentage;
    this.newPension = data.newPension;
    this.pensionImprovement = data.pensionImprovement;
    this.improvementPercentage = data.improvementPercentage;
    this.currentAverageSickDays = data.currentAverageSickDays;
    this.newAverageSickDays = data.newAverageSickDays;
  }
}

export class FewerSickDaysScenarioDto {
  @ApiProperty({
    description: "Current monthly pension (with sick days)",
    example: 3456.78,
  })
  currentPension: number;

  @ApiProperty({
    description: "Is sick leave currently included",
    example: true,
  })
  currentlyIncludesSickLeave: boolean;

  @ApiProperty({
    description: "Options for reducing sick days",
    type: [FewerSickDaysOptionDto],
  })
  options: Array<FewerSickDaysOptionDto>;

  constructor(data: FewerSickDaysScenarioDto) {
    this.currentPension = data.currentPension;
    this.currentlyIncludesSickLeave = data.currentlyIncludesSickLeave;
    this.options = data.options.map((opt) => new FewerSickDaysOptionDto(opt));
  }
}

export class ImprovementScenariosDto {
  @ApiProperty({
    description: "Scenario 1: Increase salary",
    type: SalaryIncreaseScenarioDto,
  })
  salaryIncrease: SalaryIncreaseScenarioDto;

  @ApiProperty({
    description: "Scenario 2: Work longer",
    type: WorkLongerScenarioDto,
  })
  workLonger: WorkLongerScenarioDto;

  @ApiProperty({
    description: "Scenario 3: Reduce sick days",
    type: FewerSickDaysScenarioDto,
  })
  fewerSickDays: FewerSickDaysScenarioDto;

  constructor(data: ImprovementScenariosDto) {
    this.salaryIncrease = new SalaryIncreaseScenarioDto(data.salaryIncrease);
    this.workLonger = new WorkLongerScenarioDto(data.workLonger);
    this.fewerSickDays = new FewerSickDaysScenarioDto(data.fewerSickDays);
  }
}

export class GetSimulationResultResponseDto {
  @ApiProperty({
    description: "Simulation result ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Simulation request ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  requestId: string;

  @ApiProperty({
    description: "Expected pension amount entered by user",
    example: 5000,
  })
  expectedPension: number;

  @ApiProperty({ description: "Summary of key pension metrics" })
  summary: PensionSummaryDto;

  @ApiProperty({
    description: "Data for various charts and visualizations",
  })
  charts: PensionChartsDto;

  @ApiProperty({ description: "Three scenarios to improve pension" })
  improvementScenarios: ImprovementScenariosDto;

  constructor(data: {
    id: string;
    requestId: string;
    expectedPension: number;
    summary: PensionSummaryDto;
    charts: PensionChartsDto;
    improvementScenarios: ImprovementScenariosDto;
  }) {
    this.id = data.id;
    this.requestId = data.requestId;
    this.expectedPension = data.expectedPension;
    this.summary = new PensionSummaryDto(data.summary);
    this.charts = new PensionChartsDto(data.charts);
    this.improvementScenarios = new ImprovementScenariosDto(
      data.improvementScenarios,
    );
  }
}
