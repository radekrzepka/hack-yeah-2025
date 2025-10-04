import type { GetTestTableResponseDto } from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function getAllTestTablesClient() {
  const { data } = await clientFetch<Array<GetTestTableResponseDto>>(
    "/test-table",
    {
      method: "GET",
    },
  );

  return data;
}
