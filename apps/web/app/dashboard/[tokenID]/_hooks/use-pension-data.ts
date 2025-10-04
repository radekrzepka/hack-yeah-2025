"use client";

import { useQuery } from "@tanstack/react-query";

import { getSimulationDataClient } from "../_api/client/get-simulation-data";

export function usePensionData(tokenID: string) {
  console.log("usePensionData called with tokenID:", tokenID);

  const simulationQuery = useQuery({
    queryKey: ["simulation-data", tokenID],
    queryFn: () => {
      console.log("Fetching data for tokenID:", tokenID);
      return getSimulationDataClient(tokenID);
    },
    enabled: !!tokenID,
  });

  const simulationData = simulationQuery.data;

  // Transform contributionVsGrowth data for the comparison chart
  const comparisonData = simulationData?.charts.contributionVsGrowth
    ? [
        {
          name: "Prognozowana",
          projected: simulationData.charts.contributionVsGrowth.totalCapital,
          expected: 5000, // Expected pension amount
        },
      ]
    : undefined;

  return {
    simulationData,
    kpiData: simulationData?.summary,
    projectionData: simulationData?.charts.accumulationOverTime,
    comparisonData,
    improvementScenarios: simulationData?.improvementScenarios,
    isLoading: simulationQuery.isLoading,
    isError: simulationQuery.isError,
    error: simulationQuery.error,
    refetch: () => {
      simulationQuery.refetch();
    },
  };
}
