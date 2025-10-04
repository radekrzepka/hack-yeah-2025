"use client";

import type { GetTestTableResponseDto } from "@hackathon/shared";
import { Button, FormInput, TypographyH2 } from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateTestTableClient } from "../_api/client/update-test-table";
import { handleTestTableError } from "../_utils/handle-test-table-error";
import type { UpdateTestTableFormData } from "./test-table-form.validation";
import { updateTestTableSchema } from "./test-table-form.validation";

interface EditTestTableFormProps {
  item: GetTestTableResponseDto;
  onSuccess?: () => void;
}

export function EditTestTableForm({ item, onSuccess }: EditTestTableFormProps) {
  const queryClient = useQueryClient();
  const methods = useForm<UpdateTestTableFormData>({
    resolver: zodResolver(updateTestTableSchema),
    mode: "onChange",
    defaultValues: {
      email: item.email,
      firstName: item.firstName,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateTestTableFormData) =>
      updateTestTableClient(item.id, data),
    onSuccess: () => {
      toast.success("Test table record updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["test-tables"] });
      queryClient.invalidateQueries({ queryKey: ["test-table", item.id] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error(handleTestTableError(error));
    },
  });

  const onSubmit = (data: UpdateTestTableFormData) => {
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <TypographyH2>Edit Record</TypographyH2>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="firstName" label="First Name" />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => methods.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
