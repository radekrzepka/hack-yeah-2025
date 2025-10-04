"use client";

import { useMutation } from "@tanstack/react-query";

import type { LoginFormData } from "../schema";

import { loginAdmin } from "../_api/client/login";
import { handleAdminError } from "../_utils/handle-admin-error";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormData) => loginAdmin(data),
    onError: (error) => {
      const errorMessage = handleAdminError(error);
      console.error("Login error:", errorMessage);
    },
  });
}
