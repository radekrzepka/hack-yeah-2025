export class CreateSimulationRequestCommand {
  constructor(
    public readonly age: number,
    public readonly sex: "male" | "female",
    public readonly grossSalary: number,
    public readonly workStartDate: string,
    public readonly plannedRetirementYear: number,
    public readonly includeSickLeave: boolean,
  ) {}
}
