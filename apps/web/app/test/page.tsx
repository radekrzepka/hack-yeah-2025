import { getAllTestTablesServer } from "./_api/server/get-all-test-tables";
import { TestTableList } from "./_modules/test-table-list";

export default async function TestPage() {
  const testTables = await getAllTestTablesServer();

  return (
    <div className="container mx-auto py-8">
      <TestTableList initialData={testTables} />
    </div>
  );
}
