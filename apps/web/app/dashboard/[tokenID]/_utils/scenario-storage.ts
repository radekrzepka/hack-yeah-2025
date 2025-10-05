import type {
  ScenarioStorage,
  StoredScenario,
} from "../_types/scenario-storage";

import { STORAGE_KEY } from "../_types/scenario-storage";

export function getStoredScenarios(): ScenarioStorage {
  if (typeof window === "undefined") {
    return { scenarios: [], currentScenarioId: "" };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as {
        scenarios: Array<
          Omit<StoredScenario, "createdAt"> & { createdAt: string }
        >;
        currentScenarioId: string;
      };
      // Convert date strings back to Date objects
      const convertedScenarios = parsed.scenarios.map((scenario) => ({
        ...scenario,
        createdAt: new Date(scenario.createdAt),
      }));
      return {
        scenarios: convertedScenarios,
        currentScenarioId: parsed.currentScenarioId,
      };
    }
  } catch (error) {
    console.error("Error reading scenarios from localStorage:", error);
  }

  return { scenarios: [], currentScenarioId: "" };
}

export function saveStoredScenarios(storage: ScenarioStorage): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error("Error saving scenarios to localStorage:", error);
  }
}

export function addScenario(
  scenario: Omit<StoredScenario, "localId" | "createdAt">,
): StoredScenario {
  const newScenario: StoredScenario = {
    ...scenario,
    localId: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };

  const storage = getStoredScenarios();
  storage.scenarios.push(newScenario);
  storage.currentScenarioId = newScenario.localId;
  saveStoredScenarios(storage);

  return newScenario;
}

export function removeScenario(localId: string): void {
  const storage = getStoredScenarios();
  storage.scenarios = storage.scenarios.filter((s) => s.localId !== localId);

  // If we removed the current scenario, switch to the first available one
  if (storage.currentScenarioId === localId) {
    storage.currentScenarioId =
      storage.scenarios.length > 0 ? storage.scenarios[0]?.localId || "" : "";
  }

  saveStoredScenarios(storage);
}

export function setCurrentScenario(localId: string): void {
  const storage = getStoredScenarios();
  if (storage.scenarios.some((s) => s.localId === localId)) {
    storage.currentScenarioId = localId;
    saveStoredScenarios(storage);
  }
}

export function getCurrentScenario(): StoredScenario | null {
  const storage = getStoredScenarios();
  return (
    storage.scenarios.find((s) => s.localId === storage.currentScenarioId) ||
    null
  );
}
