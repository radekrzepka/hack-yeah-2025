import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@hackathon/domain";
import { defaultMaxErrorMessage, ErrorMessages } from "@hackathon/shared";
import { z } from "zod";

export const createTestTableSchema = z.object({
  email: z
    .string()
    .email({ message: ErrorMessages.VALIDATION.INVALID_EMAIL })
    .max(MAX_EMAIL_LENGTH, {
      message: defaultMaxErrorMessage("email", MAX_EMAIL_LENGTH),
    }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(MAX_NAME_LENGTH, {
      message: defaultMaxErrorMessage("first name", MAX_NAME_LENGTH),
    }),
});

export const updateTestTableSchema = z.object({
  email: z
    .string()
    .email({ message: ErrorMessages.VALIDATION.INVALID_EMAIL })
    .max(MAX_EMAIL_LENGTH, {
      message: defaultMaxErrorMessage("email", MAX_EMAIL_LENGTH),
    })
    .optional(),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(MAX_NAME_LENGTH, {
      message: defaultMaxErrorMessage("first name", MAX_NAME_LENGTH),
    })
    .optional(),
});

export type CreateTestTableFormData = z.infer<typeof createTestTableSchema>;
export type UpdateTestTableFormData = z.infer<typeof updateTestTableSchema>;
