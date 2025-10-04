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
import { cn } from "@hackathon/ui"; // Assuming a class name utility
import { Download, LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAdminData, type AdminDataRow } from "../_hooks/use-admin-data";
import { StatsCards } from "./StatsCards";

// Helper component for table cells
const Cell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "border-border flex items-center border-r px-4 py-3", // Use theme-aware border color
      className,
    )}
  >
    {children}
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useAdminData();

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

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height in pixels
    overscan: 5,
  });

  const handleExportToExcel = async () => {
    const promise = async () => {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Brak autoryzacji. Zaloguj się ponownie.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/v1/admin/data/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Pobieranie pliku nie powiodło się. Spróbuj ponownie.");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `wyniki-symulacji-${new Date().toISOString().split("T")[0]}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        // FIX: Check that filenameMatch[1] is a truthy string before assigning
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return "Plik został pomyślnie pobrany.";
    };

    toast.promise(promise(), {
      loading: "Eksportowanie do Excel...",
      success: (message) => String(message),
      error: (err) =>
        err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.",
    });
  };

  // Declarative column definition for maintainability
  const columns = useMemo(
    () => [
      {
        id: "usageDate",
        header: "Data użycia",
        className: "min-w-[120px]",
        cell: (row: AdminDataRow) => row.usageDate,
      },
      {
        id: "usageTime",
        header: "Godzina użycia",
        className: "min-w-[120px]",
        cell: (row: AdminDataRow) => row.usageTime,
      },
      {
        id: "expectedPension",
        header: "Emerytura oczekiwana",
        className: "min-w-[180px] truncate",
        cell: (row: AdminDataRow) =>
          `${row.expectedPension.toLocaleString("pl-PL")} PLN`,
      },
      {
        id: "age",
        header: "Wiek",
        className: "min-w-[80px]",
        cell: (row: AdminDataRow) => row.age,
      },
      {
        id: "sex",
        header: "Płeć",
        className: "min-w-[80px]",
        cell: (row: AdminDataRow) => (row.sex === "male" ? "M" : "K"),
      },
      {
        id: "grossSalary",
        header: "Wynagrodzenie",
        className: "min-w-[160px] truncate",
        cell: (row: AdminDataRow) =>
          `${row.grossSalary.toLocaleString("pl-PL")} PLN`,
      },
      {
        id: "includeSickLeave",
        header: "Okresy choroby",
        className: "min-w-[140px]",
        cell: (row: AdminDataRow) => (
          <Badge variant={row.includeSickLeave ? "default" : "secondary"}>
            {row.includeSickLeave ? "Tak" : "Nie"}
          </Badge>
        ),
      },
      {
        id: "mainAccountCapital",
        header: "Środki na koncie głównym",
        className: "min-w-[200px] truncate",
        cell: (row: AdminDataRow) =>
          row.mainAccountCapital
            ? `${Number(row.mainAccountCapital).toLocaleString("pl-PL")} PLN`
            : "-",
      },
      {
        id: "subAccountCapital",
        header: "Środki na subkoncie",
        className: "min-w-[200px] truncate",
        cell: (row: AdminDataRow) =>
          row.subAccountCapital
            ? `${Number(row.subAccountCapital).toLocaleString("pl-PL")} PLN`
            : "-",
      },
      {
        id: "totalCapital",
        header: "Kapitał całkowity",
        className: "min-w-[200px] truncate",
        cell: (row: AdminDataRow) =>
          row.totalCapital
            ? `${Number(row.totalCapital).toLocaleString("pl-PL")} PLN`
            : "-",
      },
      {
        id: "actualPension",
        header: "Emerytura rzeczywista",
        className: "min-w-[180px] truncate font-medium",
        cell: (row: AdminDataRow) =>
          row.actualPension
            ? `${Number(row.actualPension).toLocaleString("pl-PL")} PLN`
            : "-",
      },
      {
        id: "adjustedPension",
        header: "Emerytura urealniona",
        className: "min-w-[180px] truncate",
        cell: (row: AdminDataRow) =>
          row.adjustedPension
            ? `${Number(row.adjustedPension).toLocaleString("pl-PL")} PLN`
            : "-",
      },
      {
        id: "postalCode",
        header: "Kod pocztowy",
        className: "min-w-[120px] flex-grow",
        cell: (row: AdminDataRow) => row.postalCode || "-",
      },
    ],
    [],
  );

  if (!userLogin) {
    return null; // or a loading spinner
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      <header className="bg-background sticky top-0 z-20 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-xl font-bold">
                ZUS ADMIN
              </div>
              <h2 className="hidden text-lg font-semibold md:block">
                Panel Kontrolny
              </h2>
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
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
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

      <main className="container mx-auto px-4 py-8">
        {isError && (
          <Card className="border-destructive bg-destructive/10 mb-8">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-destructive-foreground font-medium">
                  Błąd pobierania danych
                </p>
                <p className="text-destructive-foreground/80 text-sm">
                  Sprawdź połączenie z serwerem i spróbuj ponownie.
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => refetch()}>
                Ponów
              </Button>
            </CardContent>
          </Card>
        )}

        <StatsCards data={data} />

        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Wszystkie symulacje</CardTitle>
                <CardDescription>
                  Lista wszystkich przeprowadzonych symulacji emerytalnych
                  {data?.length && ` (${data.length})`}
                </CardDescription>
              </div>
              <Button
                onClick={handleExportToExcel}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Eksportuj do Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array<number>(10)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted h-16 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : !data?.length ? (
              <p className="text-muted-foreground py-8 text-center">
                Brak danych do wyświetlenia
              </p>
            ) : (
              <div
                ref={parentRef}
                className="h-[600px] overflow-auto rounded-md border"
              >
                <div className="bg-background/95 sticky top-0 z-10 border-b text-sm font-semibold backdrop-blur-sm">
                  <div className="flex w-full">
                    {columns.map((col, index) => (
                      <Cell
                        key={col.id}
                        className={cn(
                          col.className,
                          index === columns.length - 1 && "border-r-0",
                        )}
                      >
                        {col.header}
                      </Cell>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = data[virtualRow.index];
                    if (!row) return null;
                    return (
                      <div
                        key={row.id}
                        className="flex w-full border-b text-sm"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {columns.map((col, index) => (
                          <Cell
                            key={col.id}
                            className={cn(
                              col.className,
                              index === columns.length - 1 && "border-r-0",
                            )}
                          >
                            {col.cell(row)}
                          </Cell>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
