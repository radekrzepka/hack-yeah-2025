"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hackathon/ui";
import {
  Calendar,
  Download,
  Info,
  Settings,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useGeneratePdfReport, usePensionData } from "../_hooks";
import { useAutoSaveScenario } from "../_hooks/use-auto-save-scenario";
import type { StoredScenario } from "../_types/scenario-storage";
import {
  FewerSickDaysChart,
  PensionComparisonChart,
  PensionProjectionChart,
  SalaryIncreaseChart,
  WorkLongerChart,
} from "./charts";
import { ControlPanel } from "./controls";
import { FAQ } from "./faq";
import { TopKpiCards } from "./layout";
import { ScenarioPagination } from "./scenario-pagination";
import { TipsAndRecommendations } from "./tips-and-recommendations";

export function RetirementDashboard({ tokenID }: { tokenID: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentScenario, setCurrentScenario] = useState<StoredScenario | null>(
    null,
  );

  const {
    kpiData,
    expected,
    projectionData,
    comparisonData,
    improvementScenarios,
    isLoading,
    isError,
  } = usePensionData(tokenID);
  const { mutate: generatePdfReport, isPending: isGeneratingPdf } =
    useGeneratePdfReport();

  // Auto-save current dashboard as scenario if it doesn't exist
  useAutoSaveScenario(tokenID);
  const handleDownloadReport = () => {
    generatePdfReport({ tokenID });
  };
  const scrollToControlPanel = () => {
    const controlPanel = document.getElementById("control-panel");
    if (controlPanel) {
      controlPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreateNewScenario = () => {
    const controlPanel = document.getElementById("control-panel");
    if (controlPanel) {
      controlPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="bg-background min-h-screen"
      data-testid="retirement-dashboard"
    >
      {/* Header */}
      <header className="border-border bg-card border-b print:hidden">
        <div className="container mx-auto w-[80%] px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-balance text-3xl font-bold">
                Twoja Prognoza Emerytalna
              </h1>
              <p className="text-muted-foreground ml-1 mt-2 text-pretty">
                Dashboard symulacji - dostosuj parametry i obserwuj zmiany w
                czasie rzeczywistym
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={scrollToControlPanel}
                variant="outline"
                size="lg"
              >
                <Settings className="mr-2 h-5 w-5" />
                Panel Kontrolny
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDownloadReport}
                      variant="outline"
                      size="lg"
                      disabled={isGeneratingPdf}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {isGeneratingPdf ? "Generowanie..." : "Pobierz Raport"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Generowanie raportu PDF może potrwać około 10 sekund.
                      Raport zostanie automatycznie pobrany po zakończeniu.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto w-[80%] px-4 py-8">
        <div className="space-y-6">
          {/* Scenario Pagination */}
          <ScenarioPagination
            onScenarioChange={setCurrentScenario}
            onCreateNew={handleCreateNewScenario}
            currentTokenID={tokenID}
          />

          {/* Main Visualization Area */}
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-muted-foreground">Ładowanie danych...</div>
            </div>
          ) : isError ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-destructive">
                Błąd podczas ładowania danych
              </div>
            </div>
          ) : kpiData ? (
            <TopKpiCards kpiData={{ ...kpiData, expectedPension: expected }} />
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Wskazówki Emerytalne</CardTitle>
                <CardDescription>
                  Praktyczne porady dla lepszej przyszłości emerytalnej
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <TrendingUp className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        Zwiększenie wynagrodzenia
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        Zwiększenie wynagrodzenia zwiększa emeryturę
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Calendar className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Pracuj dłużej</h4>
                      <p className="text-muted-foreground text-xs">
                        Każdy dodatkowy rok pracy zwiększa emeryturę
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Target className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        Zredukuj ilość dni chorobowych
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        Zmniejszenie ilości dni chorobowych zwiększa emeryturę
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Porównanie Emerytury
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Prognozowana vs oczekiwana emerytura
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Informacje o wykresie</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Porównanie prognozowanej emerytury z oczekiwaną kwotą
                          {""} {""}
                          {expected.toLocaleString("pl-PL")} zł.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                {comparisonData ? (
                  <PensionComparisonChart data={comparisonData} />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-muted-foreground">
                      Ładowanie danych...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Projection Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Prognoza Wysokości Emerytury
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Porównanie trzech scenariuszy rozwoju sytuacji finansowej
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Informacje o wykresie</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Wykres pokazuje prognozowaną wysokość emerytury w trzech
                        scenariuszach: optymistycznym, realistycznym i
                        pesymistycznym.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              {projectionData ? (
                <PensionProjectionChart data={projectionData} />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-muted-foreground">
                    Ładowanie danych...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Improvement Scenarios */}
          {improvementScenarios && (
            <div className="space-y-6">
              <h2 className="text-center text-3xl font-bold">
                Scenariusze Poprawy Emerytury
              </h2>
              <TipsAndRecommendations></TipsAndRecommendations>
              {/* Salary Increase Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Zwiększenie Wynagrodzenia
                  </CardTitle>
                  <CardDescription>
                    Wpływ podwyżki wynagrodzenia na wysokość emerytury
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalaryIncreaseChart
                    data={improvementScenarios.salaryIncrease}
                  />
                </CardContent>
              </Card>

              {/* Work Longer Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Praca Dłużej</CardTitle>
                  <CardDescription>
                    Korzyści z przedłużenia aktywności zawodowej
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WorkLongerChart data={improvementScenarios.workLonger} />
                </CardContent>
              </Card>

              {/* Fewer Sick Days Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Redukcja Dni Chorobowych
                  </CardTitle>
                  <CardDescription>
                    Wpływ zmniejszenia absencji chorobowej na emeryturę
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FewerSickDaysChart
                    data={improvementScenarios.fewerSickDays}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Control Panel - Bottom */}

          <div id="control-panel" className="print:hidden">
            <ControlPanel tokenID={tokenID} />
          </div>
          <div className="print:hidden">
            <FAQ></FAQ>
          </div>
        </div>
      </div>
    </div>
  );
}
