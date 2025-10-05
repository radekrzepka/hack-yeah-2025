/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FactDto {
  /**
   * Unique identifier of the fact
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * The fact content in Polish
   * @example "Podstawowy wiek emerytalny w Polsce wynosi 60 lat dla kobiet i 65 lat dla mężczyzn."
   */
  fact: string;
  /**
   * Source of the fact
   * @example "Ustawa z dnia 17 grudnia 1998 r. o emeryturach i rentach z Funduszu Ubezpieczeń Społecznych"
   */
  source: string;
}

export interface ChartDto {
  /**
   * Unique identifier of the chart
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Name of the chart in Polish
   * @example "Średnie miesięczne emerytury według rodzaju (2023)"
   */
  chartName: string;
  /**
   * Type of the chart
   * @example "bar"
   */
  chartType: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea";
  /**
   * Chart data in Chart.js format
   * @example {"labels":["Emerytury ogółem","Emerytura","Renta z tyt. niezdolności do pracy"],"datasets":[{"label":"Średnia kwota (PLN)","data":[3270.23,3389.49,2621.97],"backgroundColor":["rgba(75, 192, 192, 0.6)"]}]}
   */
  chartData: object;
  /**
   * Source of the chart data
   * @example "https://lang.zus.pl/benefits/general-information-about-old-age-pensions"
   */
  source: string;
}

export interface GetLandingPageDataResponseDto {
  /** Array of facts about ZUS and retirement */
  facts: FactDto[];
  /** Array of charts with statistical data */
  charts: ChartDto[];
}

export interface LoginRequestDto {
  /**
   * Admin login
   * @example "admin"
   */
  login: string;
  /**
   * Admin password
   * @example "123"
   */
  password: string;
}

export interface LoginResponseDto {
  /**
   * JWT token for authentication
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token: string;
}

export interface GetAllSimulationResultsResponseDto {
  /**
   * Simulation request ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Date of use (creation date)
   * @example "2024-10-04"
   */
  usageDate: string;
  /**
   * Time of use (creation time)
   * @example "14:30:00"
   */
  usageTime: string;
  /**
   * Expected pension amount
   * @example 5000
   */
  expectedPension: number;
  /**
   * Age of the person
   * @example 30
   */
  age: number;
  /**
   * Sex of the person
   * @example "male"
   */
  sex: string;
  /**
   * Gross salary amount
   * @example 7500
   */
  grossSalary: number;
  /**
   * Whether sick leave was included in calculation
   * @example true
   */
  includeSickLeave: boolean;
  /**
   * Total capital accumulated (main account + sub account)
   * @example "450000.00"
   */
  totalCapital: object | null;
  /**
   * Main account capital
   * @example "300000.00"
   */
  mainAccountCapital: object | null;
  /**
   * Sub account capital
   * @example "150000.00"
   */
  subAccountCapital: object | null;
  /**
   * Actual monthly pension (gross)
   * @example "3500.00"
   */
  actualPension: object | null;
  /**
   * Adjusted pension (monthly pension gross)
   * @example "3500.00"
   */
  adjustedPension: object | null;
  /**
   * Postal code
   * @example "00-001"
   */
  postalCode: object | null;
}

export interface SendSimulationRequestDto {
  /**
   * Age of the person
   * @min 0
   * @example 30
   */
  age: number;
  /**
   * Sex of the person
   * @example "male"
   */
  sex: "male" | "female";
  /**
   * Gross salary amount
   * @min 0
   * @example 7500
   */
  grossSalary: number;
  /**
   * Work start date in ISO 8601 format
   * @format date
   * @example "2015-01-01"
   */
  workStartDate: string;
  /**
   * Planned retirement year
   * @min 1900
   * @example 2060
   */
  plannedRetirementYear: number;
  /**
   * Whether to include sick leave in calculation
   * @example true
   */
  includeSickLeave: boolean;
  /**
   * Expected pension amount
   * @min 0
   * @example 5000
   */
  expectedPension: number;
  /**
   * Postal code
   * @pattern ^[0-9]{2}-[0-9]{3}$
   * @example "00-001"
   */
  postalCode?: string;
  /**
   * Contract type
   * @example "uop"
   */
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
  /**
   * Current ZUS funds amount
   * @min 0
   * @example 150000
   */
  currentFunds?: number;
  /**
   * Whether to include wage growth projection
   * @example true
   */
  includeWageGrowth: boolean;
  /**
   * Whether to include benefit indexation
   * @example true
   */
  includeIndexation: boolean;
}

export interface SendSimulationResponseDto {
  /**
   * Unique simulation request identifier (token)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Age of the person
   * @example 30
   */
  age: number;
  /**
   * Sex of the person
   * @example "male"
   */
  sex: "male" | "female";
  /**
   * Gross salary amount
   * @example 7500
   */
  grossSalary: number;
  /**
   * Work start date in ISO 8601 format
   * @format date
   * @example "2015-01-01"
   */
  workStartDate: string;
  /**
   * Planned retirement year
   * @example 2060
   */
  plannedRetirementYear: number;
  /**
   * Whether to include sick leave in calculation
   * @example true
   */
  includeSickLeave: boolean;
  /**
   * Expected pension amount
   * @example 5000
   */
  expectedPension: number;
  /**
   * Postal code
   * @example "00-001"
   */
  postalCode?: object;
  /**
   * Contract type
   * @example "uop"
   */
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
  /**
   * Current ZUS funds amount
   * @example 150000
   */
  currentFunds?: number;
  /**
   * Whether to include wage growth projection
   * @example true
   */
  includeWageGrowth: boolean;
  /**
   * Whether to include benefit indexation
   * @example true
   */
  includeIndexation: boolean;
}

export interface PensionSummaryDto {
  /**
   * Projected monthly pension in PLN
   * @example 3456.78
   */
  projectedPension: number;
  /**
   * Current average salary (last salary used in calculation)
   * @example 8000
   */
  currentSalary: number;
  /**
   * Replacement rate - ratio of pension to last salary (as percentage)
   * @example 43.21
   */
  replacementRate: number;
  /**
   * Years until retirement
   * @example 32
   */
  yearsToRetirement: number;
  /**
   * Total accumulated capital in PLN
   * @example 750000
   */
  totalCapital: number;
  /**
   * Retirement age
   * @example 65
   */
  retirementAge: number;
}

export interface AccumulationChartDataDto {
  /**
   * Year
   * @example 2024
   */
  year: number;
  /**
   * Age in this year
   * @example 35
   */
  age: number;
  /**
   * Total balance
   * @example 192500
   */
  totalBalance: number;
  /**
   * Main account balance
   * @example 150000
   */
  mainAccountBalance: number;
  /**
   * Sub account balance
   * @example 42500
   */
  subAccountBalance: number;
  /**
   * Yearly salary
   * @example 90000
   */
  yearlySalary: number;
}

export interface AccountBreakdownDto {
  /**
   * Main account capital in PLN
   * @example 580000
   */
  mainAccountCapital: number;
  /**
   * Main account percentage
   * @example 77.33
   */
  mainAccountPercentage: number;
  /**
   * Sub account capital in PLN
   * @example 170000
   */
  subAccountCapital: number;
  /**
   * Sub account percentage
   * @example 22.67
   */
  subAccountPercentage: number;
  /**
   * Total capital in PLN
   * @example 750000
   */
  totalCapital: number;
}

export interface ContributionVsGrowthDto {
  /**
   * Total contributions made over career
   * @example 500000
   */
  totalContributions: number;
  /**
   * Growth from valorization
   * @example 250000
   */
  valorizationGrowth: number;
  /**
   * Total capital
   * @example 750000
   */
  totalCapital: number;
  /**
   * Contribution percentage
   * @example 66.67
   */
  contributionPercentage: number;
  /**
   * Valorization percentage
   * @example 33.33
   */
  valorizationPercentage: number;
}

export interface DecadeSummaryDto {
  /**
   * Decade label
   * @example "2020-2029"
   */
  decade: string;
  /**
   * Age range
   * @example "30-39"
   */
  ageRange: string;
  /**
   * Average yearly contribution
   * @example 15000
   */
  averageYearlyContribution: number;
  /**
   * Balance at end of decade
   * @example 180000
   */
  balanceAtEnd: number;
  /**
   * Growth in this decade
   * @example 150000
   */
  growthInDecade: number;
}

export interface PensionChartsDto {
  /** Pension accumulation over time (for line chart) */
  accumulationOverTime: AccumulationChartDataDto[];
  /** Account breakdown (for pie/donut chart) */
  accountBreakdown: AccountBreakdownDto;
  /** Contribution vs Capital growth (for comparison chart) */
  contributionVsGrowth: ContributionVsGrowthDto;
  /** Decade-by-decade summary (for bar chart) */
  decadeSummary: DecadeSummaryDto[];
}

export interface SalaryIncreaseOptionDto {
  /**
   * Percentage increase
   * @example 10
   */
  increasePercentage: number;
  /**
   * New monthly salary needed
   * @example 8800
   */
  newMonthlySalary: number;
  /**
   * Salary difference
   * @example 800
   */
  salaryDifference: number;
  /**
   * New projected pension
   * @example 3802.46
   */
  newPension: number;
  /**
   * Pension improvement
   * @example 345.68
   */
  pensionImprovement: number;
  /**
   * Improvement percentage
   * @example 10
   */
  improvementPercentage: number;
}

export interface SalaryIncreaseScenarioDto {
  /**
   * Current monthly pension
   * @example 3456.78
   */
  currentPension: number;
  /** Three options for salary increase */
  options: SalaryIncreaseOptionDto[];
}

export interface WorkLongerOptionDto {
  /**
   * Additional years to work
   * @example 1
   */
  additionalYears: number;
  /**
   * New retirement age
   * @example 66
   */
  newRetirementAge: number;
  /**
   * New retirement year
   * @example 2058
   */
  newRetirementYear: number;
  /**
   * New projected pension
   * @example 3890.23
   */
  newPension: number;
  /**
   * Pension improvement
   * @example 433.45
   */
  pensionImprovement: number;
  /**
   * Improvement percentage
   * @example 12.54
   */
  improvementPercentage: number;
}

export interface WorkLongerScenarioDto {
  /**
   * Current monthly pension
   * @example 3456.78
   */
  currentPension: number;
  /** Three options for working longer */
  options: WorkLongerOptionDto[];
}

export interface FewerSickDaysOptionDto {
  /**
   * Description of the scenario
   * @example "No sick leave"
   */
  scenario: string;
  /**
   * Sick days reduction percentage
   * @example 100
   */
  reductionPercentage: number;
  /**
   * New projected pension
   * @example 3650.12
   */
  newPension: number;
  /**
   * Pension improvement
   * @example 193.34
   */
  pensionImprovement: number;
  /**
   * Improvement percentage
   * @example 5.59
   */
  improvementPercentage: number;
  /**
   * Average sick days per year currently
   * @example 10
   */
  currentAverageSickDays: number;
  /**
   * New average sick days per year
   * @example 0
   */
  newAverageSickDays: number;
}

export interface FewerSickDaysScenarioDto {
  /**
   * Current monthly pension (with sick days)
   * @example 3456.78
   */
  currentPension: number;
  /**
   * Is sick leave currently included
   * @example true
   */
  currentlyIncludesSickLeave: boolean;
  /** Options for reducing sick days */
  options: FewerSickDaysOptionDto[];
}

export interface ImprovementScenariosDto {
  /** Scenario 1: Increase salary */
  salaryIncrease: SalaryIncreaseScenarioDto;
  /** Scenario 2: Work longer */
  workLonger: WorkLongerScenarioDto;
  /** Scenario 3: Reduce sick days */
  fewerSickDays: FewerSickDaysScenarioDto;
}

export interface GetSimulationResultResponseDto {
  /**
   * Simulation result ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Simulation request ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  requestId: string;
  /**
   * Expected pension amount entered by user
   * @example 5000
   */
  expectedPension: number;
  /** Summary of key pension metrics */
  summary: PensionSummaryDto;
  /** Data for various charts and visualizations */
  charts: PensionChartsDto;
  /** Three scenarios to improve pension */
  improvementScenarios: ImprovementScenariosDto;
}

export interface HealthCheckResponseDto {
  /**
   * Overall health status
   * @example "healthy"
   */
  status: "healthy" | "unhealthy";
  /**
   * ISO timestamp of the health check
   * @example "2024-01-15T10:30:00.000Z"
   */
  timestamp: string;
  /**
   * Application uptime in seconds
   * @example 3600
   */
  uptime: number;
  /**
   * Health check response time in milliseconds
   * @example 25
   */
  responseTime: number;
  /**
   * Application version
   * @example "1.0.0"
   */
  version: string;
  /**
   * Current environment
   * @example "production"
   */
  environment: string;
  /**
   * Individual service checks
   * @example {"database":true,"api":true}
   */
  checks: object;
  /**
   * HTTP status code
   * @example 200
   */
  httpStatus: number;
}
