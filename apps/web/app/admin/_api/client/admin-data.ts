import { clientFetch } from "@/_utils/fetch/client-fetch";

export interface AdminDataRow {
  id: string;
  usageDate: string;
  usageTime: string;
  expectedPension: number;
  age: number;
  sex: string;
  grossSalary: number;
  includeSickLeave: boolean;
  totalCapital: string | null;
  mainAccountCapital: string | null;
  subAccountCapital: string | null;
  actualPension: string | null;
  adjustedPension: string | null;
  postalCode: string | null;
}

export async function getAdminData(): Promise<Array<AdminDataRow>> {
  const { data } = await clientFetch<Array<AdminDataRow>>("/admin/data", {
    method: "GET",
  });

  return data;
}
