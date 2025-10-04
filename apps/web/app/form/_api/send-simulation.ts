import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function sendSimulationClient(body: SendSimulationRequestDto) {
  const { data } = await clientFetch<
    SendSimulationResponseDto,
    SendSimulationRequestDto
  >("/simulation/send", {
    method: "POST",
    body,
  });

  return data;
}
