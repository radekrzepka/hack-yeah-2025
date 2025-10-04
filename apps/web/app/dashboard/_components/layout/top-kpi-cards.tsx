import { Card, CardContent, CardHeader, CardTitle } from "@hackathon/ui";
import { TrendingUp, Calendar, Percent, Target } from "lucide-react";

interface TopKpiCardsProps {
  kpiData: KpiData;
}

export function TopKpiCards({ kpiData }: TopKpiCardsProps) {
  const {
    projectedPension,
    expectedPension,
    replacementRate,
    yearsToRetirement,
  } = kpiData;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Prognozowana Emerytura
          </CardTitle>
          <TrendingUp className="text-chart-1 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground flex text-3xl font-bold">
            {projectedPension.toLocaleString("pl-PL")} zł{" "}
            <p className="text-muted-foreground my-auto ml-4 text-lg opacity-40">
              {"("}
              {(projectedPension - expectedPension).toLocaleString("pl-PL")} zł
              {")"}
            </p>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Scenariusz realistyczny (urealniona)
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Oczekiwana Emerytura
          </CardTitle>
          <Target className="text-chart-2 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground text-3xl font-bold">
            {expectedPension.toLocaleString("pl-PL")} zł
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Docelowa kwota emerytury
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Wskaźnik Zastąpienia
          </CardTitle>
          <Percent className="text-chart-3 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground text-3xl font-bold">
            {replacementRate.toFixed(1)}%
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Stosunek emerytury do ostatniej pensji
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Lata do Emerytury
          </CardTitle>
          <Calendar className="text-chart-4 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground text-3xl font-bold">
            {yearsToRetirement}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Pozostały czas pracy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
