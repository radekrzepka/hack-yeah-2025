"use client";

import Cookies from "js-cookie";

interface GeneratePdfReportParams {
  tokenID: string;
}

export async function generatePdfReportClient({
  tokenID,
}: GeneratePdfReportParams): Promise<Blob> {
  const authToken = Cookies.get("auth-token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/v1/simulation/${tokenID}/report`,
    {
      method: "GET",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to generate PDF report: ${response.status} - ${errorText}`,
    );
  }
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/pdf")) {
    throw new Error("Server did not return a PDF file");
  }
  const blob = await response.blob();
  return blob;
}
