import { serverFetch } from "@/_utils/fetch/server-fetch";

interface ProjectionDataPoint {
  year: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
}

interface GetPensionProjectionResponse {
  data: Array<ProjectionDataPoint>;
}

export async function getPensionProjectionServer() {
  const { data } = await serverFetch<GetPensionProjectionResponse>(
    "/pension/projection",
    {
      method: "GET",
    },
  );

  return data;
}
