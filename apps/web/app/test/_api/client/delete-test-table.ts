import type { DeleteTestTableResponseDto } from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function deleteTestTableClient(id: string) {
  const { data } = await clientFetch<DeleteTestTableResponseDto>(
    `/test-table/${id}`,
    {
      method: "DELETE",
    },
  );

  return data;
}
