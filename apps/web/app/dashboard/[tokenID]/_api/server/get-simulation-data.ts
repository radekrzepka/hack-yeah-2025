import { serverFetch } from "@/_utils/fetch/server-fetch";

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
  improvementScenarios: any;
}

export async function getSimulationDataServer(
  tokenID: string,
): Promise<GetSimulationResultResponseDto> {
  const { data } = await serverFetch<GetSimulationResultResponseDto>(
    `/simulation/${tokenID}`,
    {
      method: "GET",
    },
  );

  return data;
}
