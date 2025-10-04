import type { AdminDataRow } from "@/admin/_hooks/use-admin-data";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export async function getAdminData(): Promise<Array<AdminDataRow>> {
  const { data } = await clientFetch<Array<AdminDataRow>>("/admin/data", {
    method: "GET",
  });

  return data;
}
