"use client";

import { Button, FormInput, TypographyH2 } from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTestTableClient } from "../_api/client/create-test-table";
import { handleTestTableError } from "../_utils/handle-test-table-error";
import type { CreateTestTableFormData } from "./test-table-form.validation";
import { createTestTableSchema } from "./test-table-form.validation";

interface CreateTestTableFormProps {
  onSuccess?: () => void;
}

export function CreateTestTableForm({ onSuccess }: CreateTestTableFormProps) {
  const queryClient = useQueryClient();
  const methods = useForm<CreateTestTableFormData>({
    resolver: zodResolver(createTestTableSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTestTableClient,
    onSuccess: () => {
      toast.success("Test table record created successfully!");
      queryClient.invalidateQueries({ queryKey: ["test-tables"] });
      methods.reset();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error(handleTestTableError(error));
    },
  });

  const onSubmit = (data: CreateTestTableFormData) => {
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <TypographyH2>Create New Record</TypographyH2>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="email" label="Email" type="email" required />
          <FormInput name="firstName" label="First Name" required />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => methods.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Record"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
