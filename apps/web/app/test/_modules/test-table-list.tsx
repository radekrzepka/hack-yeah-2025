"use client";

import type { GetTestTableResponseDto } from "@hackathon/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TypographyH1,
} from "@hackathon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { deleteTestTableClient } from "../_api/client/delete-test-table";
import { getAllTestTablesClient } from "../_api/client/get-all-test-tables";
import { handleTestTableError } from "../_utils/handle-test-table-error";
import { CreateTestTableForm } from "./create-test-table-form";
import { EditTestTableForm } from "./edit-test-table-form";

interface TestTableListProps {
  initialData: Array<GetTestTableResponseDto>;
}

export function TestTableList({ initialData }: TestTableListProps) {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] =
    useState<GetTestTableResponseDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: testTables = initialData } = useQuery({
    queryKey: ["test-tables"],
    queryFn: getAllTestTablesClient,
    initialData,
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: deleteTestTableClient,
    onSuccess: () => {
      toast.success("Test table record deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["test-tables"] });
    },
    onError: (error: unknown) => {
      toast.error(handleTestTableError(error));
    },
  });

  const handleEdit = (item: GetTestTableResponseDto) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteItem(id);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TypographyH1>Test Table Records</TypographyH1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Record</DialogTitle>
            </DialogHeader>
            <CreateTestTableForm onSuccess={closeCreateModal} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  No records found. Create your first record!
                </TableCell>
              </TableRow>
            ) : (
              testTables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">
                    <Link
                      href={`/test/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {item.id.slice(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.firstName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <EditTestTableForm item={editingItem} onSuccess={closeEditModal} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
