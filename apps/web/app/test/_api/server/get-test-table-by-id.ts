import type { GetTestTableResponseDto } from "@hackathon/shared";

import { serverFetch } from "@/_utils/fetch/server-fetch";

export async function getTestTableByIdServer(id: string) {
  const { data } = await serverFetch<GetTestTableResponseDto>(
    `/test-table/${id}`,
    {
      method: "GET",
    },
  );

  return data;
}
