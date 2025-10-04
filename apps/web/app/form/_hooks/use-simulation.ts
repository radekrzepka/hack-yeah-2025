import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";
import { useMutation } from "@tanstack/react-query";

import { type PensionFormData } from "../schema";

// Transform form data to API format
function transformFormDataToApi(
  formData: PensionFormData,
): SendSimulationRequestDto {
  return {
    age: formData.age,
    sex: formData.gender,
    grossSalary: formData.salary,
    workStartDate: `${formData.startYear}-01-01`,
    plannedRetirementYear: formData.endYear,
    includeSickLeave: formData.includeSickLeave,
  };
}

export function useSimulation() {
  return useMutation({
    mutationFn: async (
      formData: PensionFormData,
    ): Promise<SendSimulationResponseDto> => {
      const apiData = transformFormDataToApi(formData);

      const response = await fetch("/api/simulation/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return response.json() as Promise<SendSimulationResponseDto>;
    },
    onSuccess: (data) => {
      console.log("Simulation sent successfully:", data);
      // Tutaj można dodać redirect do strony wyników
      // router.push(`/results/${data.id}`);
    },
    onError: (error) => {
      console.error("Simulation failed:", error);
      // Tutaj można dodać toast notification
    },
  });
}
