import type {
  CreateTestTableRequestDto,
  CreateTestTableResponseDto,
} from "@hackathon/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function createTestTableClient(body: CreateTestTableRequestDto) {
  const { data } = await clientFetch<
    CreateTestTableResponseDto,
    CreateTestTableRequestDto
  >("/test-table", {
    method: "POST",
    body,
  });

  return data;
}
