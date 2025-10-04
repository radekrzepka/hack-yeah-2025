"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EarningsAdjustment } from "../_types";
import { clientFetch } from "@/_utils/fetch/client-fetch";

interface PensionSettingsData {
  retirementAge: number;
  monthlySalary: number;
  salaryGrowthRate: number;
  includeIllnessPeriods: boolean;
  currentAge: number;
  earningsAdjustments: Array<EarningsAdjustment>;
}

interface UpdatePensionSettingsResponse {
  success: boolean;
  message: string;
}

export function useUpdatePensionSettings(): UseMutationResult<
  UpdatePensionSettingsResponse,
  Error,
  PensionSettingsData,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: PensionSettingsData,
    ): Promise<UpdatePensionSettingsResponse> => {
      const { data: response } =
        await clientFetch<UpdatePensionSettingsResponse>("/pension/settings", {
          method: "POST",
          body: data,
        });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch pension data after successful update
      queryClient.invalidateQueries({ queryKey: ["pension-kpi"] });
      queryClient.invalidateQueries({ queryKey: ["pension-projection"] });
      queryClient.invalidateQueries({ queryKey: ["pension-comparison"] });
    },
    onError: (error) => {
      console.error("Failed to update pension settings:", error);
    },
  });
}
