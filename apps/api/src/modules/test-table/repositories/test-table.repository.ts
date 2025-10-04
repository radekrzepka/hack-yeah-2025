import { testTable, TestTableInsert, TestTableSelect } from "@hackathon/db";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabaseService } from "../../database/services/database.service";
import { ITestTableRepository } from "./test-table.repository.interface";

@Injectable()
export class TestTableRepository implements ITestTableRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: string): Promise<TestTableSelect | null> {
    const [record] = await this.db.client
      .select()
      .from(testTable)
      .where(eq(testTable.id, id));
    return record || null;
  }

  async findByEmail(email: string): Promise<TestTableSelect | null> {
    const [record] = await this.db.client
      .select()
      .from(testTable)
      .where(eq(testTable.email, email));
    return record || null;
  }

  async findAll(): Promise<Array<TestTableSelect>> {
    const records = await this.db.client.select().from(testTable);
    return records;
  }

  async create(data: TestTableInsert): Promise<TestTableSelect | null> {
    const [createdRecord] = await this.db.client
      .insert(testTable)
      .values(data)
      .returning();
    return createdRecord || null;
  }

  async update(id: string, data: Partial<TestTableInsert>): Promise<void> {
    await this.db.client
      .update(testTable)
      .set(data)
      .where(eq(testTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.client.delete(testTable).where(eq(testTable.id, id));
  }
}
