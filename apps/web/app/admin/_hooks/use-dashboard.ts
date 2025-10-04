"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "../_api/client/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboardData,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
