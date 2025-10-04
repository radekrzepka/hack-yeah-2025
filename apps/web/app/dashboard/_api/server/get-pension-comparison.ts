import { serverFetch } from "@/_utils/fetch/server-fetch";

interface ComparisonDataPoint {
  name: string;
  projected: number;
  expected: number;
}

interface GetPensionComparisonResponse {
  data: Array<ComparisonDataPoint>;
}

export async function getPensionComparisonServer() {
  const { data } = await serverFetch<GetPensionComparisonResponse>(
    "/pension/comparison",
    {
      method: "GET",
    },
  );

  return data;
}
