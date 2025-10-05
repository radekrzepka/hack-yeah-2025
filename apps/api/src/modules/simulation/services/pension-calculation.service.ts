import { Injectable } from "@nestjs/common";

import { DataProviderService } from "./data-provider.service";

export interface SimulationInput {
  age: number;
  sex: "male" | "female";
  grossSalary: number;
  workStartDate: string;
  plannedRetirementYear: number;
  includeSickLeave: boolean;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
  currentFunds?: number;
  includeWageGrowth: boolean;
  includeIndexation: boolean;
  postalCode?: string;
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
  constructor(private readonly dataProvider: DataProviderService) { }

  async calculatePension(input: SimulationInput): Promise<PensionCalculationResult> {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - input.age;
    const workStartYear = new Date(input.workStartDate).getFullYear();
    const retirementYear = input.plannedRetirementYear;
    const retirementAge = retirementYear - birthYear;
    let mainAccountCapital = input.currentFunds || 0.0;
    let subAccountCapital = 0.0;
    let totalContributions = 0.0;
    const yearlyBreakdown: Array<YearlyBreakdownItem> = [];

    // Get contribution rates based on contract type
    const contributionRates = this.getContributionRates(input.contractType);
    const totalContributionRate = contributionRates.total;

    let lastYearlySalary = input.grossSalary * 12;
    for (let year = workStartYear; year < retirementYear; year++) {
      const currentAge = year - birthYear;
      const yearlyParams = this.dataProvider.getParametersForYear(year);
      if (!yearlyParams) {
        continue;
      }
      // Apply wage growth projection if enabled
      let estimatedYearlySalary = this.dataProvider.estimateSalaryForYear({
        currentSalary: input.grossSalary * 12,
        currentYear,
        targetYear: year,
      });

      // Apply wage growth projection if enabled
      if (input.includeWageGrowth) {
        const wageGrowthRate = yearlyParams.wageGrowthIndex;
        estimatedYearlySalary *= wageGrowthRate;
      }

      lastYearlySalary = estimatedYearlySalary;

      // Use contract-specific contribution rates
      const subAccountRate = contributionRates.subAccount;
      const mainAccountRate = contributionRates.mainAccount;
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
    // Apply sick leave impact if enabled
    if (input.includeSickLeave) {
      // Get real absence data based on postal code and sex
      const absencePercentage = await this.dataProvider.getAbsenceDataForPostalCode(
        input.postalCode || "",
        input.sex
      );

      // Convert percentage to reduction factor (e.g., 35% absence = 0.35 reduction)
      const sickLeaveReduction = absencePercentage / 100;
      mainAccountCapital *= (1 - sickLeaveReduction);
      subAccountCapital *= (1 - sickLeaveReduction);
    }

    const totalCapital = mainAccountCapital + subAccountCapital;
    const valorizationGrowth = totalCapital - totalContributions;
    const averageLifeExpectancyMonths = this.dataProvider.getLifeExpectancy({
      age: retirementAge,
      year: retirementYear,
      sex: input.sex,
    });

    let monthlyPensionGross = totalCapital / averageLifeExpectancyMonths;

    // Apply benefit indexation if enabled
    if (input.includeIndexation) {
      // Apply annual indexation (assume 2% per year after retirement)
      const indexationRate = 1.02;
      monthlyPensionGross *= indexationRate;
    }
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

  private getContributionRates(contractType: "uop" | "b2b" | "zlecenie" | "dzielo"): {
    total: number;
    mainAccount: number;
    subAccount: number;
  } {
    switch (contractType) {
      case "uop":
        return {
          total: 0.1952, // 19.52%
          mainAccount: 0.1222, // 12.22%
          subAccount: 0.0730, // 7.3% (lub 0.0438 ZUS + 0.0292 OFE, jeśli wybrano)
        };
      case "b2b":
        return {
          total: 0.1952, // 19.52% - obowiązkowe
          mainAccount: 0.1222, // 12.22%
          subAccount: 0.0730, // 7.3% (lub 0.0438 ZUS + 0.0292 OFE, jeśli wybrano)
        };
      case "zlecenie":
        return {
          total: 0.1952, // 19.52% - obowiązkowe, jeśli jedyna umowa
          mainAccount: 0.1222, // 12.22%
          subAccount: 0.0730, // 7.3% (lub 0.0438 ZUS + 0.0292 OFE, jeśli wybrano)
        };
      case "dzielo":
        return {
          total: 0.0, // 0% - brak składek
          mainAccount: 0.0, // 0%
          subAccount: 0.0, // 0%
        };
      default:
        return {
          total: 0.0,
          mainAccount: 0.0,
          subAccount: 0.0,
        };
    }
  }
}
