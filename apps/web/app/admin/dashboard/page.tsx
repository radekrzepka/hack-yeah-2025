"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hackathon/ui";
import {
  Activity,
  BarChart3,
  Calendar,
  LogOut,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "../_hooks/use-dashboard";

export default function AdminDashboard() {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useDashboard();

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");

    if (!token) {
      toast.error("Brak autoryzacji", {
        description:
          "Zaloguj się, aby uzyskać dostęp do panelu administracyjnego",
      });
      router.push("/admin");
      return;
    }

    const storedLogin =
      localStorage.getItem("adminLogin") ||
      sessionStorage.getItem("adminLogin");

    setUserLogin(storedLogin || "admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLogin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminLogin");

    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    toast.success("Wylogowano pomyślnie");
    router.push("/admin");
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ${days === 1 ? "dzień" : "dni"} temu`;
    if (hours > 0) return `${hours} ${hours === 1 ? "godzinę" : "godzin"} temu`;
    if (minutes > 0)
      return `${minutes} ${minutes === 1 ? "minutę" : "minut"} temu`;
    return "Teraz";
  };

  if (!userLogin) {
    return null;
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-xl font-bold">
                ZUS ADMIN
              </div>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold">Panel Kontrolny</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Odśwież</span>
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">@{userLogin}</p>
                  <p className="text-muted-foreground text-xs">Administrator</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Wyloguj</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error State */}
        {isError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="font-medium text-red-900">
                  Błąd pobierania danych
                </p>
                <p className="text-sm text-red-700">
                  Sprawdź połączenie z serwerem
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Ponów
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Simulations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wszystkie symulacje
              </CardTitle>
              <BarChart3 className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="bg-muted h-8 w-24 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats.totalSimulations.toLocaleString("pl-PL") || "0"}
                </div>
              )}
              {data?.stats.monthlyGrowth !== undefined && (
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {data.stats.monthlyGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      data.stats.monthlyGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {Math.abs(data.stats.monthlyGrowth).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs miesiąc temu</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today Simulations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dzisiaj</CardTitle>
              <Activity className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="bg-muted h-8 w-16 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats.todaySimulations || "0"}
                </div>
              )}
              {data?.stats.dailyGrowth !== undefined && (
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {data.stats.dailyGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      data.stats.dailyGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {Math.abs(data.stats.dailyGrowth).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs wczoraj</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktywni użytkownicy
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="bg-muted h-8 w-20 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats.activeUsers.toLocaleString("pl-PL") || "0"}
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Ostatnie 30 dni
              </p>
            </CardContent>
          </Card>

          {/* Average Pension */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Średnia emerytura
              </CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="bg-muted h-8 w-28 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats.averagePension.toLocaleString("pl-PL", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0"}{" "}
                  <span className="text-muted-foreground text-base font-normal">
                    PLN
                  </span>
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Ze wszystkich symulacji
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
            <CardDescription>Najnowsze zdarzenia w systemie</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {data?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {activity.details}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="truncate">{activity.user}</span>
                        <span>•</span>
                        <span className="whitespace-nowrap">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
                {(!data?.recentActivity ||
                  data.recentActivity.length === 0) && (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    Brak ostatnich aktywności
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
