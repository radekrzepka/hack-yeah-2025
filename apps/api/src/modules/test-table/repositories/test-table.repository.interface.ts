import type { TestTableInsert, TestTableSelect } from "@hackathon/db";

export interface ITestTableRepository {
  findById(id: string): Promise<TestTableSelect | null>;
  findByEmail(email: string): Promise<TestTableSelect | null>;
  findAll(): Promise<Array<TestTableSelect>>;
  create(testTable: TestTableInsert): Promise<TestTableSelect | null>;
  update(id: string, testTable: Partial<TestTableInsert>): Promise<void>;
  delete(id: string): Promise<void>;
}
