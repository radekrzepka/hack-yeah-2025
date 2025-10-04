export interface SimulationRequest {
  age: number;
  sex: "male" | "female";
  grossSalary: number;
  workStartDate: string;
  plannedRetirementYear: number;
  includeSickLeave: boolean;
  additionalData?: {
    currentFunds?: number;
    postalCode?: string;
    targetPension?: number;
    includeWageGrowth?: boolean;
    includeIndexation?: boolean;
  };
}

export interface SimulationResponse {
  token: string;
}

export async function sendSimulationRequest(
  data: SimulationRequest,
): Promise<SimulationResponse> {
  const response = await fetch("/api/simulation/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  return response.json();
}
