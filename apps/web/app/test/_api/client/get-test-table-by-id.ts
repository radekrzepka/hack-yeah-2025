import type { GetTestTableResponseDto } from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function getTestTableByIdClient(id: string) {
  const { data } = await clientFetch<GetTestTableResponseDto>(
    `/test-table/${id}`,
    {
      method: "GET",
    },
  );

  return data;
}
