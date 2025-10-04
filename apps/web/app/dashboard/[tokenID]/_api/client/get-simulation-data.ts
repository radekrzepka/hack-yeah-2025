"use client";

import { clientFetch } from "@/_utils/fetch/client-fetch";

// Import types directly from source until shared package is built
export interface GetSimulationResultResponseDto {
  id: string;
  requestId: string;
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
