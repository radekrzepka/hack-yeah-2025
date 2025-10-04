import { ApiProperty } from "@nestjs/swagger";
import type { ChartTableSelect, FactsTableSelect } from "@hackathon/db";

export class FactDto {
  @ApiProperty({
    description: "Unique identifier of the fact",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "The fact content in Polish",
    example: "Podstawowy wiek emerytalny w Polsce wynosi 60 lat dla kobiet i 65 lat dla mężczyzn.",
  })
  fact: string;

  @ApiProperty({
    description: "Source of the fact",
    example: "Ustawa z dnia 17 grudnia 1998 r. o emeryturach i rentach z Funduszu Ubezpieczeń Społecznych",
  })
  source: string;

  constructor(data: FactsTableSelect) {
    this.id = data.id;
    this.fact = data.fact;
    this.source = data.source;
  }
}

export class ChartDto {
  @ApiProperty({
    description: "Unique identifier of the chart",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Name of the chart in Polish",
    example: "Średnie miesięczne emerytury według rodzaju (2023)",
  })
  chartName: string;

  @ApiProperty({
    description: "Type of the chart",
    example: "bar",
    enum: ["bar", "line", "pie", "doughnut", "radar", "polarArea"],
  })
  chartType: string;

  @ApiProperty({
    description: "Chart data in Chart.js format",
    example: {
      labels: ["Emerytury ogółem", "Emerytura", "Renta z tyt. niezdolności do pracy"],
      datasets: [
        {
          label: "Średnia kwota (PLN)",
          data: [3270.23, 3389.49, 2621.97],
          backgroundColor: ["rgba(75, 192, 192, 0.6)"],
        },
      ],
    },
  })
  chartData: unknown;

  @ApiProperty({
    description: "Source of the chart data",
    example: "https://lang.zus.pl/benefits/general-information-about-old-age-pensions",
  })
  source: string;

  constructor(data: ChartTableSelect) {
    this.id = data.id;
    this.chartName = data.chartName;
    this.chartType = data.chartType;
    this.chartData = data.chartData;
    this.source = data.source;
  }
}

export class GetLandingPageDataResponseDto {
  @ApiProperty({
    description: "Array of facts about ZUS and retirement",
    type: [FactDto],
  })
  facts: FactDto[];

  @ApiProperty({
    description: "Array of charts with statistical data",
    type: [ChartDto],
  })
  charts: ChartDto[];

  constructor(facts: FactsTableSelect[], charts: ChartTableSelect[]) {
    this.facts = facts.map((fact) => new FactDto(fact));
    this.charts = charts.map((chart) => new ChartDto(chart));
  }
}
