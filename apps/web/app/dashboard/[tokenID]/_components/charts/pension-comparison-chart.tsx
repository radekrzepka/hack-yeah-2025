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
      color: "rgb(0, 120, 52)",
    },
    expected: {
      label: "Oczekiwana Emerytura",
      color: "rgb(0, 65, 110)",
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
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()} zł `,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px", textAlign: "center" }}
          iconType="rect"
        />
        <Bar
          dataKey="projected"
          fill={chartConfig.projected.color}
          name="Prognozowana Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expected"
          fill={chartConfig.expected.color}
          name="Oczekiwana Emerytura"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
