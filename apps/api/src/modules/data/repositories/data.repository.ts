import {
  chartsTable,
  ChartTableSelect,
  factsTable,
  FactsTableSelect,
} from "@hackathon/db";
import { Injectable } from "@nestjs/common";

import { DatabaseService } from "../../database/services/database.service";
import { IDataRepository } from "./data.repository.interface";

@Injectable()
export class DataRepository implements IDataRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllFacts(): Promise<Array<FactsTableSelect>> {
    const facts = await this.db.client.select().from(factsTable);
    return facts;
  }

  async findAllCharts(): Promise<Array<ChartTableSelect>> {
    const charts = await this.db.client.select().from(chartsTable);
    return charts;
  }
}
