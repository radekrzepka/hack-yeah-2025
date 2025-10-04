"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@hackathon/ui";
import {
  Users,
  BarChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import type { AdminDataRow } from "../_hooks/use-admin-data";

// This should match the structure of your data from useAdminData
interface StatsCardsProps {
  data: Array<AdminDataRow> | undefined;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: {
    value: number;
    description: string;
  };
  description?: string;
}) => {
  const isIncrease = change ? change.value >= 0 : false;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-muted-foreground flex items-center text-xs">
            {isIncrease ? (
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={isIncrease ? "text-green-500" : "text-red-500"}>
              {change.value.toFixed(1)}%
            </span>
            <span className="ml-1">{change.description}</span>
          </p>
        )}
        {description && !change && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const StatsCards = ({ data }: StatsCardsProps) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalAnalyses: 0,
        analysesToday: 0,
        percentageChange: 0,
        averagePension: 0,
        averageAge: 0,
        maleCount: 0,
        femaleCount: 0,
      };
    }

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(
      yesterday.getMonth() + 1,
    ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    const analysesToday = data.filter(
      (d) => d.usageDate === todayString,
    ).length;

    const analysesYesterday = data.filter(
      (d) => d.usageDate === yesterdayString,
    ).length;

    const percentageChange =
      analysesYesterday > 0
        ? ((analysesToday - analysesYesterday) / analysesYesterday) * 100
        : analysesToday > 0
          ? 100
          : 0;

    const totalAnalyses = data.length;

    const totalPension = data.reduce(
      (sum, item) => sum + Number(item.expectedPension),
      0,
    );
    const averagePension = totalAnalyses > 0 ? totalPension / totalAnalyses : 0;

    const totalAge = data.reduce((sum, item) => sum + Number(item.age), 0);
    const averageAge = totalAnalyses > 0 ? totalAge / totalAnalyses : 0;

    const maleCount = data.filter((d) => d.sex === "male").length;
    const femaleCount = data.filter((d) => d.sex === "female").length;

    return {
      totalAnalyses,
      analysesToday,
      percentageChange,
      averagePension,
      averageAge,
      maleCount,
      femaleCount,
    };
  }, [data]);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Wszystkie symulacje"
        value={stats.totalAnalyses.toLocaleString("pl-PL")}
        icon={BarChart}
      />
      <StatCard
        title="Symulacje dzisiaj"
        value={stats.analysesToday.toLocaleString("pl-PL")}
        icon={Clock}
        change={{
          value: stats.percentageChange,
          description: "od wczoraj",
        }}
      />
      <StatCard
        title="Średnia oczekiwana emerytura"
        value={stats.averagePension.toLocaleString("pl-PL", {
          style: "currency",
          currency: "PLN",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        icon={Wallet}
      />
      <StatCard
        title="Demografia (M / K)"
        value={`${stats.maleCount} / ${stats.femaleCount}`}
        description={`Średni wiek: ${stats.averageAge.toFixed(1)} lat`}
        icon={Users}
      />
    </div>
  );
};
