"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminData } from "../_api/client/admin-data";

export function useAdminData() {
  return useQuery({
    queryKey: ["admin", "data"],
    queryFn: getAdminData,
    refetchInterval: 60000,
    retry: 2,
    staleTime: 30000,
  });
}

export type AdminDataRow = {
  id: string; // Unique identifier for the row
  usageDate: string; // e.g., "2025-10-26"
  usageTime: string; // e.g., "14:35:01"
  expectedPension: number;
  age: number;
  sex: "male" | "female"; // Strict type for 'sex'
  grossSalary: number;
  includeSickLeave: boolean;
  // API returns these as strings that can be null
  mainAccountCapital: string | null;
  subAccountCapital: string | null;
  totalCapital: string | null;
  actualPension: string | null;
  adjustedPension: string | null;
  postalCode: string | null;
};
