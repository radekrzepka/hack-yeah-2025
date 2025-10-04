import { clientFetch } from "@/_utils/fetch/client-fetch";

export interface DashboardStats {
  totalSimulations: number;
  todaySimulations: number;
  activeUsers: number;
  averagePension: number;
  monthlyGrowth: number;
  dailyGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: "simulation" | "login" | "export";
  user: string;
  timestamp: string;
  details: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivity: Array<RecentActivity>;
}

export async function getDashboardData(): Promise<DashboardResponse> {
  const { data } = await clientFetch<DashboardResponse>("/admin/dashboard", {
    method: "GET",
  });

  return data;
}
