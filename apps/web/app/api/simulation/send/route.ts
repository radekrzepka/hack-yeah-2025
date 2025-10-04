import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: SendSimulationRequestDto = await request.json();

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

    const response: SendSimulationResponseDto = {
      id: token,
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
