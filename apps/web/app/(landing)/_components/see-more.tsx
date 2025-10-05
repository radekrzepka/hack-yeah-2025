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

// Define a reusable type for the chart data structure
type ChartDataType = {
  labels: Array<string>;
  datasets: Array<{
    data: Array<number>;
    label: string;
  }>;
};

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
        <CardTitle className="text-lg font-bold text-gray-900 lg:text-xl">
          Waloryzacja pomaga, ale dźwignią jest kariera
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
          {/* Left side - text content */}
          <div className="order-2 space-y-3 lg:order-1 lg:space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                Co widać:
              </p>
              <p className="text-xs text-gray-600 lg:text-sm">
                Wskaźniki waloryzacji są zmienne (od ok. 3–5% do kilkunastu
                procent), a średnia emerytura rośnie w czasie.
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                Co to znaczy dla Ciebie:
              </p>
              <p className="text-xs text-gray-600 lg:text-sm">
                Waloryzacja chroni siłę nabywczą, ale to{" "}
                <strong>Twoje decyzje zawodowe</strong> są główną dźwignią:
                dłuższa aktywność, mniej przerw w karierze, wyższa pensja i
                regularne składki. Na tym masz największą kontrolę.
              </p>
            </div>

            <div className="pt-1 lg:pt-2">
              <Button
                className="w-full rounded-md bg-green-600 p-2 text-xs font-medium text-white transition-colors hover:bg-green-700 lg:w-auto lg:text-sm"
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
              onMouseEnter={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }}
              onFocus={() => {
                if (intervalRef.current) {
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

                  const chartData = chart.chartData as ChartDataType;

                  const data =
                    chartData?.labels.map((label, index) => ({
                      label,
                      value: chartData.datasets[0]?.data[index] || 0,
                    })) || [];

                  const isLineChart = chart.chartType === "line";

                  const chartDataDescription = data
                    .map((d) => `${d.label}: ${d.value}`)
                    .join(", ");

                  return (
                    <CarouselItem key={chart.id}>
                      <div className="mt-4">
                        <div className="mb-2 text-sm text-gray-700">
                          <strong>Wykres:</strong> {chart.chartName}
                        </div>
                        <ChartContainer
                          config={chartConfig}
                          className="h-[250px] w-full"
                        >
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
                                dot={{
                                  fill: "#1e40af",
                                  strokeWidth: 2,
                                  r: 4,
                                }}
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
                              <Bar
                                dataKey="value"
                                fill="#1e40af"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          )}
                        </ChartContainer>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious
                aria-label="Poprzedni wykres"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              />
              <CarouselNext
                aria-label="Następny wykres"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
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

  const getChartData = (chartData: unknown) => {
    const data = chartData as ChartDataType;
    return (
      data?.labels.map((label, index) => ({
        label,
        value: data.datasets[0]?.data[index] || 0,
      })) || []
    );
  };

  const minimalPensionData = getChartData(minimalPensionChart?.chartData);
  const replacementRateData = getChartData(replacementRateChart?.chartData);

  return (
    <div id="see-more-section" className="m-5">
      <TypographyH3 className="mb-6 text-2xl font-bold text-gray-900">
        Dowiedz się więcej
      </TypographyH3>

      {/* Card 3: Minimalna emerytura */}
      <Card className="mb-6 border border-gray-200 bg-[#fefefe] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 lg:text-xl">
            Minimalna emerytura to bezpieczna baza — celuj wyżej
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
            {/* Left side - text content */}
            <div className="order-2 space-y-3 lg:order-1 lg:space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                  Co widać:
                </p>
                <p className="text-xs text-gray-600 lg:text-sm">
                  Minimalna emerytura rośnie, ale traktuj ją jako{" "}
                  <strong>sieć bezpieczeństwa</strong>, nie cel.
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                  Co to znaczy dla Ciebie:
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 lg:space-y-2 lg:text-sm">
                  <li>
                    Każda dodatkowa{" "}
                    <strong>umowa o pracę/zlecenie ze składkami</strong>, każdy
                    rok dłużej i każda podwyżka przesuwają Cię{" "}
                    <strong>powyżej minimum</strong>
                  </li>
                  <li>
                    W praktyce: opłaca się utrzymać ciągłość zatrudnienia i
                    budować staż
                  </li>
                </ul>
              </div>

              <div className="pt-1 lg:pt-2">
                <Button
                  className="w-full rounded-md bg-green-600 p-2 text-xs font-medium text-white transition-colors hover:bg-green-700 lg:w-auto lg:text-sm"
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
                  <div className="mb-2 text-sm text-gray-700">
                    <strong>Wykres:</strong> {minimalPensionChart.chartName}
                  </div>
                  <div
                    role="img"
                    aria-label={`Wykres ${minimalPensionChart.chartName}. Dane: ${minimalPensionData.map((d) => `${d.label}: ${d.value} PLN`).join(", ")}`}
                  >
                    <ChartContainer
                      config={chartConfig}
                      className="h-[300px] w-full"
                    >
                      <LineChart data={minimalPensionData} accessibilityLayer>
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
          <CardTitle className="text-lg font-bold text-gray-900 lg:text-xl">
            Luka po zakończeniu pracy: co naprawdę ją zmniejsza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
            {/* Left side - text content */}
            <div className="order-2 space-y-3 lg:order-1 lg:space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                  Co widać:
                </p>
                <p className="text-xs text-gray-600 lg:text-sm">
                  Niezależnie od poziomu zarobków, stopa zastąpienia oscyluje
                  wokół ~30%. To oznacza, że emerytura z systemu publicznego
                  jest wyraźnie niższa niż pensja.
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700 lg:mb-2 lg:text-sm">
                  Co to znaczy dla Ciebie:
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 lg:space-y-2 lg:text-sm">
                  <li>
                    <strong>Wyższa podstawa = wyższa emerytura</strong> (nawet
                    przy podobnej stopie). Każdy awans, nowa kwalifikacja,
                    zmiana firmy na lepiej płatną — realnie podnosi przyszłe
                    świadczenie
                  </li>
                  <li>
                    <strong>Dłuższa praca = dłuższy staż składkowy</strong> i
                    krótszy okres podziału zgromadzonego kapitału po starcie
                    emerytury — to podwójny efekt na plus
                  </li>
                </ul>
              </div>

              <div className="pt-1 lg:pt-2">
                <Button
                  className="w-full rounded-md bg-green-600 p-2 text-xs font-medium text-white transition-colors hover:bg-green-700 lg:w-auto lg:text-sm"
                  onClick={() => window.open("/form", "_blank")}
                  aria-label="Sprawdź, ile daje +24 miesiące pracy (otwiera się w nowej karcie)"
                >
                  Sprawdź, ile daje +24 miesiące pracy
                </Button>
              </div>
            </div>

            {/* Right side - chart */}
            <div className="order-1 lg:order-2">
              {replacementRateChart && (
                <div>
                  <div className="mb-2 text-sm text-gray-700">
                    <strong>Wykres:</strong> {replacementRateChart.chartName}
                  </div>
                  <div
                    role="img"
                    aria-label={`Wykres ${replacementRateChart.chartName}. Dane: ${replacementRateData.map((d) => `${d.label}: ${d.value}%`).join(", ")}`}
                  >
                    <ChartContainer
                      config={chartConfig}
                      className="h-[350px] w-full"
                    >
                      <BarChart data={replacementRateData} accessibilityLayer>
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
                        <Bar
                          dataKey="value"
                          fill="#1e40af"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
