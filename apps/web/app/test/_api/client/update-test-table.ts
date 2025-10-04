import type {
  UpdateTestTableRequestDto,
  UpdateTestTableResponseDto,
} from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function updateTestTableClient(
  id: string,
  body: UpdateTestTableRequestDto,
) {
  const { data } = await clientFetch<
    UpdateTestTableResponseDto,
    UpdateTestTableRequestDto
  >(`/test-table/${id}`, {
    method: "PUT",
    body,
  });

  return data;
}
