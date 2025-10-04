"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hackathon/ui";
import { Button } from "@hackathon/ui";
import { PensionProjectionChart, PensionComparisonChart } from "./charts";
import { TopKpiCards } from "./layout";
import { ControlPanel } from "./controls";
import { usePensionData } from "../_hooks/use-pension-data";
import {
  Download,
  Info,
  Settings,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hackathon/ui";
import { FAQ } from "./faq";
import { TipsAndRecommendations } from "./tips-and-recommendations";

export function RetirementDashboard() {
  const { kpiData, projectionData, comparisonData, isLoading, isError } =
    usePensionData();
  const handleDownloadReport = () => {
    // Placeholder for PDF generation
    console.log("Downloading report...");
  };

  const scrollToControlPanel = () => {
    const controlPanel = document.getElementById("control-panel");
    if (controlPanel) {
      controlPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
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
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Pobierz Raport
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto w-[80%] px-4 py-8">
        <div className="space-y-6">
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
            <TopKpiCards kpiData={kpiData} />
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
                      <h4 className="text-sm font-medium">Zwiększ składki</h4>
                      <p className="text-muted-foreground text-xs">
                        Rozważ dodatkowe składki do OFE lub IKE
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
                      <h4 className="text-sm font-medium">Inwestuj mądrze</h4>
                      <p className="text-muted-foreground text-xs">
                        Rozważ długoterminowe inwestycje
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
                          4500 zł.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                {comparisonData ? (
                  <PensionComparisonChart data={comparisonData.data} />
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

          <TipsAndRecommendations></TipsAndRecommendations>
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
                <PensionProjectionChart data={projectionData.data} />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-muted-foreground">
                    Ładowanie danych...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Control Panel - Bottom */}
          <div id="control-panel">
            <ControlPanel />
          </div>
          <div>
            <FAQ></FAQ>
          </div>
        </div>
      </div>
    </div>
  );
}
