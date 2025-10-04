import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();

    // Walidacja podstawowych danych
    if (
      !body.age ||
      !body.sex ||
      !body.grossSalary ||
      !body.workStartDate ||
      !body.plannedRetirementYear
    ) {
      return NextResponse.json(
        { error: "Brakuje wymaganych danych" },
        { status: 400 },
      );
    }

    // Tutaj będzie logika wysyłania do backendu (RADEK)
    // Na razie symulujemy odpowiedź
    const token = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log("Received simulation request:", body);

    // TODO: Wysłać dane do backendu RADEK
    // const backendResponse = await fetch('http://backend-url/api/simulation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body)
    // });

    const response: SimulationResponse = {
      token: token,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Simulation API error:", error);
    return NextResponse.json(
      { error: "Błąd przetwarzania żądania" },
      { status: 500 },
    );
  }
}
