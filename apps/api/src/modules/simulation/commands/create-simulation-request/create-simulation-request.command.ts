export interface CustomExperiencePeriod {
  yearStart: number;
  yearEnd: number;
  monthlySalary: number;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
}

export class CreateSimulationRequestCommand {
  constructor(
    public readonly age: number,
    public readonly sex: "male" | "female",
    public readonly grossSalary: number,
    public readonly workStartDate: string,
    public readonly plannedRetirementYear: number,
    public readonly includeSickLeave: boolean,
    public readonly expectedPension: number,
    public readonly postalCode?: string,
    public readonly contractType: "uop" | "b2b" | "zlecenie" | "dzielo" = "uop",
    public readonly currentFunds?: number,
    public readonly includeWageGrowth: boolean = false,
    public readonly includeIndexation: boolean = false,
    public readonly customExperience?: Array<CustomExperiencePeriod>,
  ) {}
}
