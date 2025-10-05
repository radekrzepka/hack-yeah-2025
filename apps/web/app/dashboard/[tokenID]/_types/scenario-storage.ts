export interface StoredScenario {
  localId: string;
  actualId: string;
  createdAt: Date;
  name: string;
  description?: string;
  parameters: {
    age: number;
    expectedPension: number;
    tokenID: string;
    typeOfEmployment: string;
  };
}

export interface ScenarioStorage {
  scenarios: Array<StoredScenario>;
  currentScenarioId: string;
}

export const STORAGE_KEY = "pension-scenarios";
