"use client";

import { clientFetch } from "@/_utils/fetch/client-fetch";

// Import types directly from source until shared package is built
export interface CustomExperiencePeriodDto {
  yearStart: number;
  yearEnd: number;
  monthlySalary: number;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
}

export interface SimulationConfigDto {
  age: number;
  sex: "male" | "female";
  grossSalary: number;
  workStartDate: string;
  plannedRetirementYear: number;
  includeSickLeave: boolean;
  expectedPension: number;
  postalCode?: string | null;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
  currentFunds?: number;
  includeWageGrowth: boolean;
  includeIndexation: boolean;
  customExperience?: Array<CustomExperiencePeriodDto>;
}

export interface GetSimulationResultResponseDto {
  id: string;
  requestId: string;
  expectedPension: number;
  config: SimulationConfigDto;
  summary: {
    projectedPension: number;
    currentSalary: number;
    replacementRate: number;
    yearsToRetirement: number;
    totalCapital: number;
    retirementAge: number;
  };
  charts: {
    accumulationOverTime: Array<{
      year: number;
      age: number;
      totalBalance: number;
      mainAccountBalance: number;
      subAccountBalance: number;
      yearlySalary: number;
    }>;
    accountBreakdown: {
      mainAccountCapital: number;
      mainAccountPercentage: number;
      subAccountCapital: number;
      subAccountPercentage: number;
      totalCapital: number;
    };
    contributionVsGrowth: {
      totalContributions: number;
      valorizationGrowth: number;
      totalCapital: number;
      contributionPercentage: number;
      valorizationPercentage: number;
    };
    decadeSummary: Array<{
      decade: string;
      ageRange: string;
      averageYearlyContribution: number;
      balanceAtEnd: number;
      growthInDecade: number;
    }>;
  };
  improvementScenarios: {
    salaryIncrease: {
      currentPension: number;
      options: Array<{
        increasePercentage: number;
        newMonthlySalary: number;
        salaryDifference: number;
        newPension: number;
        pensionImprovement: number;
        improvementPercentage: number;
      }>;
    };
    workLonger: {
      currentPension: number;
      options: Array<{
        additionalYears: number;
        newRetirementAge: number;
        newRetirementYear: number;
        newPension: number;
        pensionImprovement: number;
        improvementPercentage: number;
      }>;
    };
    fewerSickDays: {
      currentPension: number;
      currentlyIncludesSickLeave: boolean;
      options: Array<{
        scenario: string;
        reductionPercentage: number;
        newPension: number;
        pensionImprovement: number;
        improvementPercentage: number;
        currentAverageSickDays: number;
        newAverageSickDays: number;
      }>;
    };
  };
}

export async function getSimulationDataClient(
  tokenID: string,
): Promise<GetSimulationResultResponseDto> {
  const { data } = await clientFetch<GetSimulationResultResponseDto>(
    `/simulation/${tokenID}`,
    {
      method: "GET",
    },
  );

  return data;
}
