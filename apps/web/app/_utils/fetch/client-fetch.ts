import Cookies from "js-cookie";

import type { ApiResponse } from "./shared";

import { ApiError, parseError, parseSuccess } from "./shared";

export async function clientFetch<T, V = unknown>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: V;
  },
): Promise<ApiResponse<T>> {
  const authToken = Cookies.get("auth-token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1${endpoint}`,
    {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    },
  );

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    const { message, status } = await parseError(response, contentType);
    throw new ApiError(message, status);
  }

  return {
    data: await parseSuccess(response, contentType),
    status: response.status,
  };
}
