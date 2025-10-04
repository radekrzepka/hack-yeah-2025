"use client";

import type { GetTestTableResponseDto } from "@hackathon/shared";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TypographyH1,
  TypographyP,
} from "@hackathon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteTestTableClient } from "../_api/client/delete-test-table";
import { getTestTableByIdClient } from "../_api/client/get-test-table-by-id";
import { handleTestTableError } from "../_utils/handle-test-table-error";
import { EditTestTableForm } from "./edit-test-table-form";

interface TestTableDetailProps {
  initialData: GetTestTableResponseDto;
  itemId: string;
}

export function TestTableDetail({ initialData, itemId }: TestTableDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: item = initialData } = useQuery({
    queryKey: ["test-table", itemId],
    queryFn: () => getTestTableByIdClient(itemId),
    initialData,
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: deleteTestTableClient,
    onSuccess: () => {
      toast.success("Test table record deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["test-tables"] });
      router.push("/test");
    },
    onError: (error: unknown) => {
      toast.error(handleTestTableError(error));
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteItem(itemId);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel Edit
          </Button>
        </div>
        <EditTestTableForm item={item} onSuccess={handleEditSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/test">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
          <TypographyH1>Test Table Record</TypographyH1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <TypographyP className="text-sm font-semibold text-gray-600">
              ID
            </TypographyP>
            <TypographyP className="font-mono text-sm">{item.id}</TypographyP>
          </div>
          <div>
            <TypographyP className="text-sm font-semibold text-gray-600">
              Email
            </TypographyP>
            <TypographyP>{item.email}</TypographyP>
          </div>
          <div>
            <TypographyP className="text-sm font-semibold text-gray-600">
              First Name
            </TypographyP>
            <TypographyP>{item.firstName}</TypographyP>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
