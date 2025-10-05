"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@hackathon/ui";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
interface PensionProjectionChartProps {
  data: Array<{
    year: number;
    age: number;
    totalBalance: number;
    mainAccountBalance: number;
    subAccountBalance: number;
    yearlySalary: number;
  }>;
}

export function PensionProjectionChart({ data }: PensionProjectionChartProps) {
  const chartConfig = {
    totalBalance: {
      label: "Całkowity Kapitał",
      color: "rgb(255,179,79)",
    },
    mainAccountBalance: {
      label: "Konto Główne",
      color: "rgb(0, 153, 63)",
    },
    subAccountBalance: {
      label: "Konto Podrzędne",
      color: "rgb(0, 65, 110)",
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
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()} zł `,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px", textAlign: "center" }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="totalBalance"
          stroke={chartConfig.totalBalance.color}
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Całkowity Kapitał"
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="mainAccountBalance"
          stroke={chartConfig.mainAccountBalance.color}
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Konto Główne"
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="subAccountBalance"
          stroke={chartConfig.subAccountBalance.color}
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Konto Podrzędne"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
