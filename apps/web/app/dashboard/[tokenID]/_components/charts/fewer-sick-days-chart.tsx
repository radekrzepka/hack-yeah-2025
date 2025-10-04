"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@hackathon/ui";

interface FewerSickDaysOption {
  scenario: string;
  reductionPercentage: number;
  newPension: number;
  pensionImprovement: number;
  improvementPercentage: number;
  currentAverageSickDays: number;
  newAverageSickDays: number;
}

interface FewerSickDaysChartProps {
  data: {
    currentPension: number;
    currentlyIncludesSickLeave: boolean;
    options: FewerSickDaysOption[];
  };
}

export function FewerSickDaysChart({ data }: FewerSickDaysChartProps) {
  const chartData = data.options.map((option) => ({
    name: option.scenario,
    currentPension: data.currentPension,
    newPension: option.newPension,
    improvement: option.pensionImprovement,
    sickDaysReduction: option.reductionPercentage,
  }));

  const chartConfig = {
    currentPension: {
      label: "Aktualna Emerytura",
      color: "hsl(0, 70%, 50%)",
    },
    newPension: {
      label: "Nowa Emerytura",
      color: "hsl(160, 60%, 45%)",
    },
    improvement: {
      label: "Poprawa",
      color: "hsl(220, 70%, 50%)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          className="text-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()} zł`,
            name,
          ]}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
        <Bar
          dataKey="currentPension"
          fill="hsl(0, 70%, 50%)"
          name="Aktualna Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="newPension"
          fill="hsl(160, 60%, 45%)"
          name="Nowa Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="improvement"
          fill="hsl(220, 70%, 50%)"
          name="Poprawa"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
