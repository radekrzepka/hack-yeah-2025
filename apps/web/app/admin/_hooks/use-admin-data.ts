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
