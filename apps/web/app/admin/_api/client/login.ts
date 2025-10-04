import type { LoginFormData } from "../../schema";
import { clientFetch } from "@/_utils/fetch/client-fetch";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginAdmin(data: LoginFormData): Promise<LoginResponse> {
  const { data: response } = await clientFetch<LoginResponse, LoginRequest>(
    "/admin/login",
    {
      method: "POST",
      body: {
        login: data.login,
        password: data.password,
      },
    },
  );

  return response;
}
