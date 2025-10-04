import { useMutation } from "@tanstack/react-query";

import type { SimulationRequest } from "../_api/simulation";

import { sendSimulationRequest } from "../_api/simulation";
import { type PensionFormData } from "../schema";

// Transform form data to API format
function transformFormDataToApi(formData: PensionFormData): SimulationRequest {
  return {
    age: formData.age,
    sex: formData.gender,
    grossSalary: formData.salary,
    workStartDate: `${formData.startYear}-01-01`,
    plannedRetirementYear: formData.endYear,
    includeSickLeave: formData.includeSickLeave,
    additionalData: {
      currentFunds: formData.currentFunds,
      postalCode: formData.postalCode,
      targetPension: formData.targetPension,
      includeWageGrowth: formData.includeWageGrowth,
      includeIndexation: formData.includeIndexation,
    },
  };
}

export function useSimulation() {
  return useMutation({
    mutationFn: (formData: PensionFormData) => {
      const apiData = transformFormDataToApi(formData);
      return sendSimulationRequest(apiData);
    },
    onSuccess: (data) => {
      console.log("Simulation sent successfully:", data);
      // Tutaj można dodać redirect do strony wyników
      // router.push(`/results/${data.token}`);
    },
    onError: (error) => {
      console.error("Simulation failed:", error);
      // Tutaj można dodać toast notification
    },
  });
}
