export interface ApiResponse<T> {
  data: T;
  status: number;
}

export async function parseSuccess<T>(
  response: Response,
  contentType: string,
): Promise<T> {
  if (contentType.includes("application/json")) {
    const data = (await response.json()) as unknown as T;
    return data;
  }
  return response.text() as T;
}

export async function parseError(
  response: Response,
  contentType: string,
): Promise<{ status: number; message: string }> {
  if (contentType.includes("application/json")) {
    const data = (await response.json()) as unknown;

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return {
        status: response.status,
        message: data.message,
      };
    }
  }

  return {
    status: response.status,
    message: response.statusText,
  };
}

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
