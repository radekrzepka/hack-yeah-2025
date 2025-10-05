import { z } from "zod";

import {
  basePensionFields,
  validateEndYearAfterStartYear,
  validateWorkPeriod,
} from "../../../_shared/schemas/pension-form-base";

// Przykład jak można rozszerzyć bazowy schemat o dodatkowe pola
export const pensionFormSchema = z
  .object({
    ...basePensionFields,
    // Tutaj można dodać dodatkowe pola specyficzne dla dashboardu
    // np.:
    // dashboardSpecificField: z.string().optional(),
    // anotherField: z.number().min(0).optional(),
  })
  .refine(validateEndYearAfterStartYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia",
    path: ["endYear"],
  })
  .refine(validateWorkPeriod, {
    message: "Okres pracy powinien wynosić co najmniej 20 lat",
    path: ["endYear"],
  });

export type PensionFormData = z.infer<typeof pensionFormSchema>;
