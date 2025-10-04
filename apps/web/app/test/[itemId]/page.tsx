import { notFound } from "next/navigation";

import { getTestTableByIdServer } from "../_api/server/get-test-table-by-id";
import { TestTableDetail } from "../_modules/test-table-detail";

interface TestTableDetailPageProps {
  params: {
    itemId: string;
  };
}

export default async function TestTableDetailPage({
  params,
}: TestTableDetailPageProps) {
  try {
    const item = await getTestTableByIdServer(params.itemId);

    return (
      <div className="container mx-auto py-8">
        <TestTableDetail initialData={item} itemId={params.itemId} />
      </div>
    );
  } catch {
    // If the item is not found, show 404 page
    notFound();
  }
}
