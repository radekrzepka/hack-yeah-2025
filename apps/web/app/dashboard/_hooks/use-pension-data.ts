"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getKpiDataClient,
  getPensionComparisonClient,
  getPensionProjectionClient,
} from "../_api/client";

export function usePensionData() {
  const kpiQuery = useQuery({
    queryKey: ["pension-kpi"],
    queryFn: getKpiDataClient,
    enabled: true,
  });

  const projectionQuery = useQuery({
    queryKey: ["pension-projection"],
    queryFn: getPensionProjectionClient,
    enabled: true,
  });

  const comparisonQuery = useQuery({
    queryKey: ["pension-comparison"],
    queryFn: getPensionComparisonClient,
    enabled: true,
  });

  return {
    kpiData: kpiQuery.data as KpiData | undefined,
    projectionData: projectionQuery.data as
      | GetPensionProjectionResponse
      | undefined,
    comparisonData: comparisonQuery.data as
      | GetPensionComparisonResponse
      | undefined,
    isLoading:
      kpiQuery.isLoading ||
      projectionQuery.isLoading ||
      comparisonQuery.isLoading,
    isError:
      kpiQuery.isError || projectionQuery.isError || comparisonQuery.isError,
    error: kpiQuery.error || projectionQuery.error || comparisonQuery.error,
    refetch: () => {
      kpiQuery.refetch();
      projectionQuery.refetch();
      comparisonQuery.refetch();
    },
  };
}
