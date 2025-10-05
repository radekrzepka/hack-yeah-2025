"use client";

import { useCallback, useEffect } from "react";

import { addScenario, getStoredScenarios } from "../_utils/scenario-storage";
import { usePensionData } from "./use-pension-data";

export function useAutoSaveScenario(tokenID: string) {
  const { simulationData } = usePensionData(tokenID);

  const autoSaveCurrentScenario = useCallback(() => {
    if (!simulationData?.summary) return;

    const storage = getStoredScenarios();

    // Check if this tokenID already exists in scenarios
    const existingScenario = storage.scenarios.find(
      (s) => s.parameters.tokenID === tokenID,
    );

    // If scenario doesn't exist, create it
    if (!existingScenario) {
      addScenario({
        actualId: tokenID,
        name: `Scenariusz ${new Date().toLocaleDateString("pl-PL")}`,
        description: `Symulacja dla ${simulationData.summary.retirementAge - simulationData.summary.yearsToRetirement}-letniego użytkownika`,
        parameters: {
          age:
            simulationData.summary.retirementAge -
            simulationData.summary.yearsToRetirement,
          expectedPension: simulationData.expectedPension,
          tokenID: tokenID,
          typeOfEmployment: "uop", // Default value, could be enhanced to get from API
        },
      });
    }
  }, [simulationData, tokenID]);

  useEffect(() => {
    autoSaveCurrentScenario();
  }, [autoSaveCurrentScenario]);

  return { autoSaveCurrentScenario };
}
