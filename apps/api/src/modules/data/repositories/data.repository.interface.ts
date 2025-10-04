import type { ChartTableSelect, FactsTableSelect } from "@hackathon/db";

export interface IDataRepository {
  findAllFacts(): Promise<Array<FactsTableSelect>>;
  findAllCharts(): Promise<Array<ChartTableSelect>>;
}
