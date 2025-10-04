import { serverFetch } from "@/_utils/fetch/server-fetch";

interface KpiData {
  projectedPension: number;
  expectedPension: number;
  replacementRate: number;
  yearsToRetirement: number;
}

export async function getKpiDataServer() {
  const { data } = await serverFetch<KpiData>("/pension/kpi", {
    method: "GET",
  });

  return data;
}
