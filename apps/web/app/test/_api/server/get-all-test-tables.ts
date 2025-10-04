import type { GetTestTableResponseDto } from "@hackathon/shared";

import { serverFetch } from "@/_utils/fetch/server-fetch";

export async function getAllTestTablesServer() {
  const { data } = await serverFetch<Array<GetTestTableResponseDto>>(
    "/test-table",
    {
      method: "GET",
    },
  );

  return data;
}
