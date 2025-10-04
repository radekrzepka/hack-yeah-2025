import { z } from "zod";

export const loginFormSchema = z.object({
  login: z
    .string({
      required_error: "Login jest wymagany",
      invalid_type_error: "Nieprawidłowy format loginu",
    })
    .min(1, "Login jest wymagany")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Login zawiera niedozwolone znaki"),

  password: z
    .string({
      required_error: "Hasło jest wymagane",
      invalid_type_error: "Nieprawidłowe hasło",
    })
    .min(1, "Hasło jest wymagane"),

  rememberMe: z
    .boolean({
      invalid_type_error: "Nieprawidłowa wartość",
    })
    .optional()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
