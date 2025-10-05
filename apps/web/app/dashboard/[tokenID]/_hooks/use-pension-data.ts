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

  const comparisonData = simulationData?.summary
    ? [
        {
          name: "Prognozowana",
          projected: simulationData.summary.projectedPension,
          expected: simulationData.expectedPension,
        },
      ]
    : undefined;

  return {
    simulationData,
    kpiData: simulationData?.summary,
    expected: simulationData?.expectedPension || 5000,
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
