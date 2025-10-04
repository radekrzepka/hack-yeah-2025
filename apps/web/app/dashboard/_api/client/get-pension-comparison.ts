import { clientFetch } from "@/_utils/fetch/client-fetch";

interface ComparisonDataPoint {
  name: string;
  projected: number;
  expected: number;
}

interface GetPensionComparisonResponse {
  data: Array<ComparisonDataPoint>;
}

export async function getPensionComparisonClient() {
  const { data } = await clientFetch<GetPensionComparisonResponse>(
    "/pension/comparison",
    {
      method: "GET",
    },
  );

  return data;
}
