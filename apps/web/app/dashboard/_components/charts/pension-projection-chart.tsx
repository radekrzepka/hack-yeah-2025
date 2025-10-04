"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@hackathon/ui";

interface PensionProjectionChartProps {
  data: Array<ProjectionDataPoint>;
}

export function PensionProjectionChart({ data }: PensionProjectionChartProps) {
  const chartConfig = {
    optimistic: {
      label: "Scenariusz Optymistyczny",
      color: "rgb(26, 78, 218)",
    },
    realistic: {
      label: "Scenariusz Realistyczny",
      color: "rgb(0, 153, 63)",
    },
    pessimistic: {
      label: "Scenariusz Pesymistyczny",
      color: "rgb(255, 100, 103)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="year"
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
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
        <Line
          type="monotone"
          dataKey="optimistic"
          stroke="hsl(220, 70%, 50%)"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Scenariusz Optymistyczny"
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="realistic"
          stroke="hsl(160, 60%, 45%)"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Scenariusz Realistyczny"
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="pessimistic"
          stroke="hsl(0, 70%, 50%)"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Scenariusz Pesymistyczny"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
