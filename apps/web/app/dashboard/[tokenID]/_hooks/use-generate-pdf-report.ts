"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { generatePdfReportClient } from "../_api/client";

interface GeneratePdfReportParams {
  tokenID: string;
}

function downloadBlob({
  blob,
  filename,
}: {
  blob: Blob;
  filename: string;
}): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useGeneratePdfReport(): UseMutationResult<
  Blob,
  Error,
  GeneratePdfReportParams,
  unknown
> {
  return useMutation({
    mutationFn: async ({ tokenID }: GeneratePdfReportParams): Promise<Blob> => {
      return await generatePdfReportClient({ tokenID });
    },
    onSuccess: (blob, variables) => {
      const filename = `raport-emerytalny-${variables.tokenID}.pdf`;
      downloadBlob({ blob, filename });
      toast.success("Raport PDF został pobrany pomyślnie!");
    },
    onError: (error) => {
      console.error("Failed to generate PDF report:", error);
      toast.error(
        error.message ||
          "Nie udało się wygenerować raportu PDF. Spróbuj ponownie.",
      );
    },
  });
}
