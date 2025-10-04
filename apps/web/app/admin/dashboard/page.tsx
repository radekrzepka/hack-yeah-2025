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
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAdminData } from "../_hooks/use-admin-data";
import { cn } from "@hackathon/ui";
import { StatsCards } from "./StatsCards";

// Helper component for table cells to keep the main component clean
const Cell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center border-r border-slate-200 px-4 py-3", // Added border-slate-200 for visibility
      className,
    )}
  >
    {children}
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const { data, isLoading, isError } = useAdminData();

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

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5,
  });

  const handleExportToExcel = () => {
    toast.info("Eksportowanie do Excel...", {
      description: "Funkcja w przygotowaniu",
    });
  };

  if (!userLogin) {
    return null;
  }

  // Define column widths in one place to ensure header and cells match
  const columnConfig = {
    date: "min-w-[120px]",
    time: "min-w-[120px]",
    expectedPension: "min-w-[180px]",
    age: "min-w-[80px]",
    sex: "min-w-[80px]",
    salary: "min-w-[160px]",
    sickLeave: "min-w-[140px]",
    mainAccount: "min-w-[200px]",
    subAccount: "min-w-[200px]",
    totalCapital: "min-w-[200px]",
    actualPension: "min-w-[180px]",
    adjustedPension: "min-w-[180px]",
    postalCode: "min-w-[120px] flex-grow", // flex-grow to take remaining space
  };

  return (
    <div className="bg-muted/20 min-h-screen">
      {/* Header */}
      <header></header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isError && <Card></Card>}

        <StatsCards data={data} />

        <Card>
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
                {[...Array(10)].map((_, i) => (
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
                {/* Sticky Header */}
                <div className="bg-background/95 sticky top-0 z-10 border-b text-sm font-semibold backdrop-blur-sm">
                  <div className="flex w-full">
                    <Cell className={columnConfig.date}>Data użycia</Cell>
                    <Cell className={columnConfig.time}>Godzina użycia</Cell>
                    <Cell className={columnConfig.expectedPension}>
                      Emerytura oczekiwana
                    </Cell>
                    <Cell className={columnConfig.age}>Wiek</Cell>
                    <Cell className={columnConfig.sex}>Płeć</Cell>
                    <Cell className={columnConfig.salary}>Wynagrodzenie</Cell>
                    <Cell className={columnConfig.sickLeave}>
                      Okresy choroby
                    </Cell>
                    <Cell className={columnConfig.mainAccount}>
                      Środki na koncie głównym
                    </Cell>
                    <Cell className={columnConfig.subAccount}>
                      Środki na subkoncie
                    </Cell>
                    <Cell className={columnConfig.totalCapital}>
                      Kapitał całkowity
                    </Cell>
                    <Cell className={columnConfig.actualPension}>
                      Emerytura rzeczywista
                    </Cell>
                    <Cell className={columnConfig.adjustedPension}>
                      Emerytura urealniona
                    </Cell>
                    <Cell className={cn(columnConfig.postalCode, "border-r-0")}>
                      Kod pocztowy
                    </Cell>
                  </div>
                </div>

                {/* Virtualized Rows Container */}
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
                        <Cell className={columnConfig.date}>
                          {row.usageDate}
                        </Cell>
                        <Cell className={columnConfig.time}>
                          {row.usageTime}
                        </Cell>
                        <Cell
                          className={cn(
                            columnConfig.expectedPension,
                            "truncate",
                          )}
                        >
                          {row.expectedPension.toLocaleString("pl-PL")} PLN
                        </Cell>
                        <Cell className={columnConfig.age}>{row.age}</Cell>
                        <Cell className={columnConfig.sex}>
                          {row.sex === "male" ? "M" : "K"}
                        </Cell>
                        <Cell className={cn(columnConfig.salary, "truncate")}>
                          {row.grossSalary.toLocaleString("pl-PL")} PLN
                        </Cell>
                        <Cell className={columnConfig.sickLeave}>
                          <Badge
                            variant={
                              row.includeSickLeave ? "default" : "secondary"
                            }
                          >
                            {row.includeSickLeave ? "Tak" : "Nie"}
                          </Badge>
                        </Cell>
                        <Cell
                          className={cn(columnConfig.mainAccount, "truncate")}
                        >
                          {row.mainAccountCapital
                            ? `${Number(row.mainAccountCapital).toLocaleString("pl-PL")} PLN`
                            : "-"}
                        </Cell>
                        <Cell
                          className={cn(columnConfig.subAccount, "truncate")}
                        >
                          {row.subAccountCapital
                            ? `${Number(row.subAccountCapital).toLocaleString("pl-PL")} PLN`
                            : "-"}
                        </Cell>
                        <Cell
                          className={cn(columnConfig.totalCapital, "truncate")}
                        >
                          {row.totalCapital
                            ? `${Number(row.totalCapital).toLocaleString("pl-PL")} PLN`
                            : "-"}
                        </Cell>
                        <Cell
                          className={cn(
                            columnConfig.actualPension,
                            "truncate font-medium",
                          )}
                        >
                          {row.actualPension
                            ? `${Number(row.actualPension).toLocaleString("pl-PL")} PLN`
                            : "-"}
                        </Cell>
                        <Cell
                          className={cn(
                            columnConfig.adjustedPension,
                            "truncate",
                          )}
                        >
                          {row.adjustedPension
                            ? `${Number(row.adjustedPension).toLocaleString("pl-PL")} PLN`
                            : "-"}
                        </Cell>
                        <Cell
                          className={cn(columnConfig.postalCode, "border-r-0")}
                        >
                          {row.postalCode || "-"}
                        </Cell>
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
