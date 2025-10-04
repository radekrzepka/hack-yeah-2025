import { clientFetch } from "@/_utils/fetch/client-fetch";

interface ProjectionDataPoint {
  year: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
}

interface GetPensionProjectionResponse {
  data: Array<ProjectionDataPoint>;
}

export async function getPensionProjectionClient() {
  const { data } = await clientFetch<GetPensionProjectionResponse>(
    "/pension/projection",
    {
      method: "GET",
    },
  );

  return data;
}
