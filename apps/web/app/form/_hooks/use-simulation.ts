import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";
import { useMutation } from "@tanstack/react-query";

import { sendSimulationClient } from "../_api/send-simulation";
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
      return sendSimulationClient(apiData);
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
