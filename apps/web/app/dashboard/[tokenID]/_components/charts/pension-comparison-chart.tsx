"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@hackathon/ui";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

interface PensionComparisonChartProps {
  data: Array<{ name: string; projected: number; expected: number }>;
}

// const expectedPension = 5000;

export function PensionComparisonChart({ data }: PensionComparisonChartProps) {
  const chartConfig = {
    projected: {
      label: "Prognozowana Emerytura",
      color: "hsl(160, 60%, 45%)",
    },
    expected: {
      label: "Oczekiwana Emerytura",
      color: "hsl(220, 70%, 50%)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          className="text-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [`${value.toLocaleString()} zł`, ""]}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px", textAlign: "center" }}
          iconType="rect"
        />
        <Bar
          dataKey="projected"
          fill="hsl(160, 60%, 45%)"
          name="Prognozowana Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expected"
          fill="hsl(220, 70%, 50%)"
          name="Oczekiwana Emerytura"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
