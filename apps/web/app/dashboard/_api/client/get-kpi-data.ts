import { clientFetch } from "@/_utils/fetch/client-fetch";

interface KpiData {
  projectedPension: number;
  expectedPension: number;
  replacementRate: number;
  yearsToRetirement: number;
}

export async function getKpiDataClient() {
  const { data } = await clientFetch<KpiData>("/pension/kpi", {
    method: "GET",
  });

  return data;
}
