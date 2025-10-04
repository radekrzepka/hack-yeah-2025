import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { sendSimulationClient } from "../_api/send-simulation";
import { type PensionFormData } from "../schema";

// Transform form data to API format
function transformFormDataToApi(
  formData: PensionFormData,
): SendSimulationRequestDto {
  const apiData: SendSimulationRequestDto = {
    age: formData.age,
    sex: formData.gender,
    grossSalary: formData.salary,
    workStartDate: `${formData.startYear}-01-01`,
    plannedRetirementYear: formData.endYear,
    includeSickLeave: formData.includeSickLeave,
    expectedPension: formData.targetPension,
  };

  // Dodaj postalCode tylko jeśli jest wypełniony
  if (formData.postalCode && formData.postalCode.trim() !== "") {
    apiData.postalCode = formData.postalCode.trim();
  }

  return apiData;
}

export function useSimulation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      formData: PensionFormData,
    ): Promise<SendSimulationResponseDto> => {
      const apiData = transformFormDataToApi(formData);
      return sendSimulationClient(apiData);
    },
    onSuccess: (data) => {
      console.log("Simulation sent successfully:", data);
      // Przekieruj na dashboard z ID symulacji
      router.push(`/dashboard/${data.id}`);
    },
    onError: (error) => {
      console.error("Simulation failed:", error);
      // Tutaj można dodać toast notification
    },
  });
}
