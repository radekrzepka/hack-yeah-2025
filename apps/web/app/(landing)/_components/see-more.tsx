"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  TypographyH3,
  TypographyP,
} from "@hackathon/ui";
import { useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import type { LandingPageData } from "../_api/get-landing-data";

// Chart configurations with ZUS colors
const chartConfig = {
  value: {
    label: "Wartość",
    color: "#1e40af", // ZUS blue
  },
  amount: {
    label: "Kwota",
    color: "#1e40af", // ZUS blue
  },
  rate: {
    label: "Wskaźnik",
    color: "#1e40af", // ZUS blue
  },
};

type Props = {
  initialData: LandingPageData;
};

function SeeMoreCard({
  title,
  content,
  chart,
  ctaText,
  ctaLink,
}: {
  title: string;
  content: string;
  chart?: {
    id: string;
    chartName: string;
    chartType: string;
    chartData: unknown;
    source: string;
  };
  ctaText?: string;
  ctaLink?: string;
}) {
  const chartData = chart?.chartData as {
    labels: string[];
    datasets: Array<{
      data: number[];
      label: string;
    }>;
  };

  const data =
    chartData?.labels.map((label, index) => ({
      label,
      value: chartData.datasets[0]?.data[index] || 0,
    })) || [];

  const isLineChart = chart?.chartType === "line";
  const isBarChart = chart?.chartType === "bar";

  return (
    <Card className="mb-6 pb-6 border border-gray-200 bg-[#fefefe] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TypographyP className="leading-relaxed text-gray-700">
          {content}
        </TypographyP>

        {chart && (
          <div className="mt-4">
            <div className="mb-2 text-sm text-gray-600">
              <strong>Wykres:</strong> {chart.chartName}
            </div>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              {isLineChart ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1e40af"
                    strokeWidth={3}
                    dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ChartContainer>
          </div>
        )}

        {ctaText && ctaLink && (
          <div className="mt-4">
            <Button
              className="rounded-md bg-green-600 p-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              onClick={() => window.open(ctaLink, "_blank")}
            >
              {ctaText}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CareerLeverageCard({
  indexationChart,
  averagePensionChart,
}: {
  indexationChart?: {
    id: string;
    chartName: string;
    chartType: string;
    chartData: unknown;
    source: string;
  };
  averagePensionChart?: {
    id: string;
    chartName: string;
    chartType: string;
    chartData: unknown;
    source: string;
  };
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const charts = [indexationChart, averagePensionChart].filter(Boolean);

  if (charts.length === 0) return null;

  return (
    <Card className="mb-6 border border-gray-200 bg-[#fefefe] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
          Waloryzacja pomaga, ale dźwignią jest kariera
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
          {/* Left side - text content */}
          <div className="space-y-3 lg:space-y-4 order-2 lg:order-1">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co widać:</p>
              <p className="text-xs lg:text-sm text-gray-600">
                Wskaźniki waloryzacji są zmienne (od ok. 3–5% do kilkunastu procent), a średnia emerytura rośnie w czasie.
              </p>
            </div>

            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co to znaczy dla Ciebie:</p>
              <p className="text-xs lg:text-sm text-gray-600">
                Waloryzacja chroni siłę nabywczą, ale to <strong>Twoje decyzje zawodowe</strong> są główną dźwignią: dłuższa aktywność, mniej przerw w karierze, wyższa pensja i regularne składki. Na tym masz największą kontrolę.
              </p>
            </div>

            <div className="pt-1 lg:pt-2">
              <Button
                className="w-full lg:w-auto rounded-md bg-green-600 p-2 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-green-700"
                onClick={() => window.open("/form", "_blank")}
              >
                Zobacz wpływ podwyżki o 10%
              </Button>
            </div>
          </div>

          {/* Right side - chart carousel */}
          <div className="order-1 lg:order-2">
            <Carousel
              ref={(el) => {
                if (!el && intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }}
              opts={{ align: "start", loop: true }}
              className="relative w-full"
              setApi={(api) => {
                if (api && !intervalRef.current) {
                  intervalRef.current = setInterval(() => {
                    api.scrollNext();
                  }, 10000);
                }
                if (!api && intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }}
              onSelect={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }}
            >
              <CarouselContent>
                {charts.map((chart) => {
                  if (!chart) return null;

                  const chartData = chart.chartData as {
                    labels: string[];
                    datasets: Array<{
                      data: number[];
                      label: string;
                    }>;
                  };

                  const data =
                    chartData?.labels.map((label, index) => ({
                      label,
                      value: chartData.datasets[0]?.data[index] || 0,
                    })) || [];

                  const isLineChart = chart.chartType === "line";

                  return (
                    <CarouselItem key={chart.id}>
                      <div className="mt-4">
                        <div className="mb-2 text-sm text-gray-600">
                          <strong>Wykres:</strong> {chart.chartName}
                        </div>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                          {isLineChart ? (
                            <LineChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#1e40af"
                                strokeWidth={3}
                                dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
                              />
                            </LineChart>
                          ) : (
                            <BarChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis tick={{ fontSize: 12 }} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          )}
                        </ChartContainer>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SeeMore({ initialData }: Props) {
  const charts = initialData?.charts ?? [];

  // Find specific charts
  const minimalPensionChart = charts.find(
    (chart) => chart.chartName === "Wzrost emerytury minimalnej (2017-2025)",
  );

  const indexationChart = charts.find(
    (chart) => chart.chartName === "Wskaźniki waloryzacji emerytur (2020-2025)",
  );

  const averagePensionChart = charts.find(
    (chart) => chart.chartName === "Wzrost średniej emerytury (2020-2025)",
  );

  const replacementRateChart = charts.find(
    (chart) =>
      chart.chartName === "Stopy zastąpienia brutto według poziomu zarobków",
  );

  return (
    <div id="see-more-section" className="m-5">
      <TypographyH3 className="mb-6 text-2xl font-bold text-gray-900">
        Dowiedz się więcej
      </TypographyH3>

      {/* Card 3: Minimalna emerytura */}
      <Card className="mb-6 border border-gray-200 bg-[#fefefe] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
            Minimalna emerytura to bezpieczna baza — celuj wyżej
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
            {/* Left side - text content */}
            <div className="space-y-3 lg:space-y-4 order-2 lg:order-1">
              <div>
                <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co widać:</p>
                <p className="text-xs lg:text-sm text-gray-600">
                  Minimalna emerytura rośnie, ale traktuj ją jako <strong>sieć bezpieczeństwa</strong>, nie cel.
                </p>
              </div>

              <div>
                <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co to znaczy dla Ciebie:</p>
                <ul className="list-disc list-inside space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600">
                  <li>
                    Każda dodatkowa <strong>umowa o pracę/zlecenie ze składkami</strong>, każdy rok dłużej i każda podwyżka przesuwają Cię <strong>powyżej minimum</strong>
                  </li>
                  <li>
                    W praktyce: opłaca się utrzymać ciągłość zatrudnienia i budować staż
                  </li>
                </ul>
              </div>

              <div className="pt-1 lg:pt-2">
                <Button
                  className="w-full lg:w-auto rounded-md bg-green-600 p-2 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-green-700"
                  onClick={() => window.open("/form", "_blank")}
                >
                  Sprawdź, jak wypadasz względem minimum
                </Button>
              </div>
            </div>

            {/* Right side - chart */}
            <div className="order-1 lg:order-2">
              {minimalPensionChart && (
                <div>
                  <div className="mb-2 text-sm text-gray-600">
                    <strong>Wykres:</strong> {minimalPensionChart.chartName}
                  </div>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart
                      data={
                        (
                          minimalPensionChart.chartData as {
                            labels: string[];
                            datasets: Array<{ data: number[]; label: string }>;
                          }
                        )?.labels.map((label, index) => ({
                          label,
                          value:
                            (
                              minimalPensionChart.chartData as {
                                labels: string[];
                                datasets: Array<{ data: number[]; label: string }>;
                              }
                            ).datasets[0]?.data[index] || 0,
                        })) || []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1e40af"
                        strokeWidth={3}
                        dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CareerLeverageCard
        indexationChart={indexationChart}
        averagePensionChart={averagePensionChart}
      />

      {/* Card 1: Luka po zakończeniu pracy */}
      <Card className="mb-6 border border-gray-200 bg-[#fefefe] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
            Luka po zakończeniu pracy: co naprawdę ją zmniejsza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
            {/* Left side - text content */}
            <div className="space-y-3 lg:space-y-4 order-2 lg:order-1">
              <div>
                <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co widać:</p>
                <p className="text-xs lg:text-sm text-gray-600">
                  Niezależnie od poziomu zarobków, stopa zastąpienia oscyluje wokół ~30%. To oznacza, że emerytura z systemu publicznego jest wyraźnie niższa niż pensja.
                </p>
              </div>

              <div>
                <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">Co to znaczy dla Ciebie:</p>
                <ul className="list-disc list-inside space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600">
                  <li>
                    <strong>Wyższa podstawa = wyższa emerytura</strong> (nawet przy podobnej stopie). Każdy awans, nowa kwalifikacja, zmiana firmy na lepiej płatną — realnie podnosi przyszłe świadczenie
                  </li>
                  <li>
                    <strong>Dłuższa praca = dłuższy staż składkowy</strong> i krótszy okres podziału zgromadzonego kapitału po starcie emerytury — to podwójny efekt na plus
                  </li>
                </ul>
              </div>

              <div className="pt-1 lg:pt-2">
                <Button
                  className="w-full lg:w-auto rounded-md bg-green-600 p-2 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-green-700"
                  onClick={() => window.open("/form", "_blank")}
                >
                  Sprawdź, ile daje +24 miesiące pracy
                </Button>
              </div>
            </div>

            {/* Right side - chart */}
            <div className="order-1 lg:order-2">
              {replacementRateChart && (
                <div>
                  <div className="mb-2 text-sm text-gray-600">
                    <strong>Wykres:</strong> {replacementRateChart.chartName}
                  </div>
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart
                      data={
                        (
                          replacementRateChart.chartData as {
                            labels: string[];
                            datasets: Array<{ data: number[]; label: string }>;
                          }
                        )?.labels.map((label, index) => ({
                          label,
                          value:
                            (
                              replacementRateChart.chartData as {
                                labels: string[];
                                datasets: Array<{ data: number[]; label: string }>;
                              }
                            ).datasets[0]?.data[index] || 0,
                        })) || []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
