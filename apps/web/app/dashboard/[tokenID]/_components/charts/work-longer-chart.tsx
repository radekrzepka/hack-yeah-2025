"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@hackathon/ui";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

interface WorkLongerOption {
  additionalYears: number;
  newRetirementAge: number;
  newRetirementYear: number;
  newPension: number;
  pensionImprovement: number;
  improvementPercentage: number;
}

interface WorkLongerChartProps {
  data: {
    currentPension: number;
    options: Array<WorkLongerOption>;
  };
}

export function WorkLongerChart({ data }: WorkLongerChartProps) {
  const chartData = data.options.map((option) => ({
    name: `+${option.additionalYears} lat`,
    currentPension: data.currentPension,
    newPension: option.newPension,
    improvement: option.pensionImprovement,
    retirementAge: option.newRetirementAge,
  }));

  const chartConfig = {
    currentPension: {
      label: "Aktualna Emerytura",
      color: "rgb(255,179,79)",
    },
    newPension: {
      label: "Nowa Emerytura",
      color: "rgb(0, 120, 52)",
    },
    improvement: {
      label: "Poprawa",
      color: "rgb(0, 65, 110)",
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
        />
        <YAxis
          className="text-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number, name: string) => {
            if (name === "improvement") {
              return [`${value.toLocaleString()} zł `, "Poprawa"];
            }
            return [`${value.toLocaleString()} zł `, name];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px", textAlign: "center" }}
          iconType="rect"
        />
        <Bar
          dataKey="currentPension"
          fill={chartConfig.currentPension.color}
          name="Aktualna Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="newPension"
          fill={chartConfig.newPension.color}
          name="Nowa Emerytura"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="improvement"
          fill={chartConfig.improvement.color}
          name="Poprawa"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
