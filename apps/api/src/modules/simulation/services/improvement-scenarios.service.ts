import { Injectable } from "@nestjs/common";

import {
  FewerSickDaysOptionDto,
  FewerSickDaysScenarioDto,
  ImprovementScenariosDto,
  SalaryIncreaseOptionDto,
  SalaryIncreaseScenarioDto,
  WorkLongerOptionDto,
  WorkLongerScenarioDto,
} from "../dtos/get-simulation-result/get-simulation-result-response.dto";
import {
  PensionCalculationService,
  SimulationInput,
} from "./pension-calculation.service";

interface CalculateImprovementScenariosInput {
  baseInput: SimulationInput;
  basePension: number;
  birthYear: number;
  currentYear: number;
}

@Injectable()
export class ImprovementScenariosService {
  constructor(
    private readonly pensionCalculationService: PensionCalculationService,
  ) {}

  async calculateImprovementScenarios(
    input: CalculateImprovementScenariosInput,
  ): Promise<ImprovementScenariosDto> {
    const { baseInput, basePension, birthYear } = input;
    const salaryIncrease = await this.calculateSalaryIncreaseScenario({
      baseInput,
      basePension,
    });
    const workLonger = await this.calculateWorkLongerScenario({
      baseInput,
      basePension,
      birthYear,
    });
    const fewerSickDays = await this.calculateFewerSickDaysScenario({
      baseInput,
      basePension,
    });
    return {
      salaryIncrease,
      workLonger,
      fewerSickDays,
    };
  }

  private async calculateSalaryIncreaseScenario(params: {
    baseInput: SimulationInput;
    basePension: number;
  }): Promise<SalaryIncreaseScenarioDto> {
    const { baseInput, basePension } = params;
    const increasePercentages = [10, 20, 30];
    const options: Array<SalaryIncreaseOptionDto> = await Promise.all(
      increasePercentages.map(async (increasePercentage) => {
        const newMonthlySalary =
          baseInput.grossSalary * (1 + increasePercentage / 100);
        const salaryDifference = newMonthlySalary - baseInput.grossSalary;
        const newCalculation =
          await this.pensionCalculationService.calculatePension({
            age: baseInput.age,
            sex: baseInput.sex,
            grossSalary: newMonthlySalary,
            workStartDate: baseInput.workStartDate,
            plannedRetirementYear: baseInput.plannedRetirementYear,
            includeSickLeave: baseInput.includeSickLeave,
            contractType: baseInput.contractType,
            currentFunds: baseInput.currentFunds,
            includeWageGrowth: baseInput.includeWageGrowth,
            includeIndexation: baseInput.includeIndexation,
            postalCode: baseInput.postalCode,
          });
        const newPension = newCalculation.monthlyPensionGross;
        const pensionImprovement = newPension - basePension;
        const improvementPercentage = (pensionImprovement / basePension) * 100;
        return {
          increasePercentage,
          newMonthlySalary: this.roundToTwoDecimals(newMonthlySalary),
          salaryDifference: this.roundToTwoDecimals(salaryDifference),
          newPension: this.roundToTwoDecimals(newPension),
          pensionImprovement: this.roundToTwoDecimals(pensionImprovement),
          improvementPercentage: this.roundToTwoDecimals(improvementPercentage),
        };
      }),
    );
    return {
      currentPension: this.roundToTwoDecimals(basePension),
      options,
    };
  }

  private async calculateWorkLongerScenario(params: {
    baseInput: SimulationInput;
    basePension: number;
    birthYear: number;
  }): Promise<WorkLongerScenarioDto> {
    const { baseInput, basePension, birthYear } = params;
    const additionalYearsOptions = [1, 2, 3];
    const options: Array<WorkLongerOptionDto> = await Promise.all(
      additionalYearsOptions.map(async (additionalYears) => {
        const newRetirementYear =
          baseInput.plannedRetirementYear + additionalYears;
        const newRetirementAge = newRetirementYear - birthYear;
        const newCalculation =
          await this.pensionCalculationService.calculatePension({
            age: baseInput.age,
            sex: baseInput.sex,
            grossSalary: baseInput.grossSalary,
            workStartDate: baseInput.workStartDate,
            plannedRetirementYear: newRetirementYear,
            includeSickLeave: baseInput.includeSickLeave,
            contractType: baseInput.contractType,
            currentFunds: baseInput.currentFunds,
            includeWageGrowth: baseInput.includeWageGrowth,
            includeIndexation: baseInput.includeIndexation,
            postalCode: baseInput.postalCode,
          });
        const newPension = newCalculation.monthlyPensionGross;
        const pensionImprovement = newPension - basePension;
        const improvementPercentage = (pensionImprovement / basePension) * 100;
        return {
          additionalYears,
          newRetirementAge,
          newRetirementYear,
          newPension: this.roundToTwoDecimals(newPension),
          pensionImprovement: this.roundToTwoDecimals(pensionImprovement),
          improvementPercentage: this.roundToTwoDecimals(improvementPercentage),
        };
      }),
    );
    return {
      currentPension: this.roundToTwoDecimals(basePension),
      options,
    };
  }

  private async calculateFewerSickDaysScenario(params: {
    baseInput: SimulationInput;
    basePension: number;
  }): Promise<FewerSickDaysScenarioDto> {
    const { baseInput, basePension } = params;
    const currentlyIncludesSickLeave = baseInput.includeSickLeave;
    const averageSickDaysPerYear = 10;
    const options: Array<FewerSickDaysOptionDto> = [];
    if (currentlyIncludesSickLeave) {
      const newCalculation =
        await this.pensionCalculationService.calculatePension({
          age: baseInput.age,
          sex: baseInput.sex,
          grossSalary: baseInput.grossSalary,
          workStartDate: baseInput.workStartDate,
          plannedRetirementYear: baseInput.plannedRetirementYear,
          includeSickLeave: false,
          contractType: baseInput.contractType,
          currentFunds: baseInput.currentFunds,
          includeWageGrowth: baseInput.includeWageGrowth,
          includeIndexation: baseInput.includeIndexation,
          postalCode: baseInput.postalCode,
        });
      const newPension = newCalculation.monthlyPensionGross;
      const pensionImprovement = newPension - basePension;
      const improvementPercentage = (pensionImprovement / basePension) * 100;
      options.push({
        scenario: "No sick leave",
        reductionPercentage: 100,
        newPension: this.roundToTwoDecimals(newPension),
        pensionImprovement: this.roundToTwoDecimals(pensionImprovement),
        improvementPercentage: this.roundToTwoDecimals(improvementPercentage),
        currentAverageSickDays: averageSickDaysPerYear,
        newAverageSickDays: 0,
      });
      options.push({
        scenario: "Reduce sick leave by 50%",
        reductionPercentage: 50,
        newPension: this.roundToTwoDecimals(
          basePension + pensionImprovement * 0.5,
        ),
        pensionImprovement: this.roundToTwoDecimals(pensionImprovement * 0.5),
        improvementPercentage: this.roundToTwoDecimals(
          improvementPercentage * 0.5,
        ),
        currentAverageSickDays: averageSickDaysPerYear,
        newAverageSickDays: averageSickDaysPerYear / 2,
      });
      options.push({
        scenario: "Reduce sick leave by 25%",
        reductionPercentage: 25,
        newPension: this.roundToTwoDecimals(
          basePension + pensionImprovement * 0.25,
        ),
        pensionImprovement: this.roundToTwoDecimals(pensionImprovement * 0.25),
        improvementPercentage: this.roundToTwoDecimals(
          improvementPercentage * 0.25,
        ),
        currentAverageSickDays: averageSickDaysPerYear,
        newAverageSickDays: (averageSickDaysPerYear * 3) / 4,
      });
    } else {
      options.push({
        scenario: "Już optymalny - brak zwolnień lekarskich",
        reductionPercentage: 0,
        newPension: this.roundToTwoDecimals(basePension),
        pensionImprovement: 0,
        improvementPercentage: 0,
        currentAverageSickDays: 0,
        newAverageSickDays: 0,
      });
    }
    return {
      currentPension: this.roundToTwoDecimals(basePension),
      currentlyIncludesSickLeave,
      options,
    };
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
