import { Injectable } from "@nestjs/common";

import { DataProviderService } from "./data-provider.service";

export interface SimulationInput {
  age: number;
  sex: "male" | "female";
  grossSalary: number;
  workStartDate: string;
  plannedRetirementYear: number;
  includeSickLeave: boolean;
}

export interface YearlyBreakdownItem {
  year: number;
  age: number;
  estimatedYearlySalary: number;
  contributionToMainAccount: number;
  contributionToSubAccount: number;
  mainAccountBalance: number;
  subAccountBalance: number;
  totalBalance: number;
  mainAccountValorizationRate: number;
  subAccountValorizationRate: number;
}

export interface PensionCalculationResult {
  monthlyPensionGross: number;
  totalCapital: number;
  mainAccountCapital: number;
  subAccountCapital: number;
  averageLifeExpectancyMonths: number;
  retirementAge: number;
  yearlyBreakdown: Array<YearlyBreakdownItem>;
  totalContributions: number;
  valorizationGrowth: number;
  lastYearlySalary: number;
  currentYear: number;
  birthYear: number;
}

@Injectable()
export class PensionCalculationService {
  constructor(private readonly dataProvider: DataProviderService) {}

  calculatePension(input: SimulationInput): PensionCalculationResult {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - input.age;
    const workStartYear = new Date(input.workStartDate).getFullYear();
    const retirementYear = input.plannedRetirementYear;
    const retirementAge = retirementYear - birthYear;
    let mainAccountCapital = 0.0;
    let subAccountCapital = 0.0;
    let totalContributions = 0.0;
    const yearlyBreakdown: Array<YearlyBreakdownItem> = [];
    const totalContributionRate = this.dataProvider.getTotalContributionRate();
    let lastYearlySalary = input.grossSalary * 12;
    for (let year = workStartYear; year < retirementYear; year++) {
      const currentAge = year - birthYear;
      const yearlyParams = this.dataProvider.getParametersForYear(year);
      if (!yearlyParams) {
        continue;
      }
      const estimatedYearlySalary = this.dataProvider.estimateSalaryForYear({
        currentSalary: input.grossSalary * 12,
        currentYear,
        targetYear: year,
      });
      lastYearlySalary = estimatedYearlySalary;
      const subAccountRate = yearlyParams.subAccountRate;
      const mainAccountRate = totalContributionRate - subAccountRate;
      const contributionToSubAccount = estimatedYearlySalary * subAccountRate;
      const contributionToMainAccount = estimatedYearlySalary * mainAccountRate;
      totalContributions +=
        contributionToMainAccount + contributionToSubAccount;
      mainAccountCapital += contributionToMainAccount;
      subAccountCapital += contributionToSubAccount;
      const mainAccountValorization = yearlyParams.mainAccountValorization;
      const subAccountValorization = yearlyParams.subAccountValorization;
      mainAccountCapital *= mainAccountValorization;
      subAccountCapital *= subAccountValorization;
      yearlyBreakdown.push({
        year,
        age: currentAge,
        estimatedYearlySalary,
        contributionToMainAccount,
        contributionToSubAccount,
        mainAccountBalance: mainAccountCapital,
        subAccountBalance: subAccountCapital,
        totalBalance: mainAccountCapital + subAccountCapital,
        mainAccountValorizationRate: mainAccountValorization,
        subAccountValorizationRate: subAccountValorization,
      });
    }
    const totalCapital = mainAccountCapital + subAccountCapital;
    const valorizationGrowth = totalCapital - totalContributions;
    const averageLifeExpectancyMonths = this.dataProvider.getLifeExpectancy({
      age: retirementAge,
      year: retirementYear,
      sex: input.sex,
    });
    const monthlyPensionGross = totalCapital / averageLifeExpectancyMonths;
    return {
      monthlyPensionGross,
      totalCapital,
      mainAccountCapital,
      subAccountCapital,
      averageLifeExpectancyMonths,
      retirementAge,
      yearlyBreakdown,
      totalContributions,
      valorizationGrowth,
      lastYearlySalary,
      currentYear,
      birthYear,
    };
  }
}
