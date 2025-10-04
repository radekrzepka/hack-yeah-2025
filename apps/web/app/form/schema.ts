import { z } from "zod";

export const pensionFormSchema = z
  .object({
    // Dane obowiązkowe
    age: z
      .number({
        required_error: "Wiek jest wymagany",
        invalid_type_error: "Wiek musi być liczbą",
      })
      .int("Wiek musi być liczbą całkowitą")
      .min(18, "Wiek musi wynosić co najmniej 18 lat")
      .max(100, "Wiek nie może przekraczać 100 lat"),

    gender: z.enum(["female", "male"], {
      required_error: "Płeć jest wymagana",
      invalid_type_error: "Nieprawidłowa wartość płci",
    }),

    contractType: z.enum(["uop", "b2b", "zlecenie", "dzielo"], {
      required_error: "Rodzaj umowy jest wymagany",
      invalid_type_error: "Nieprawidłowy rodzaj umowy",
    }),

    salary: z
      .number({
        required_error: "Wynagrodzenie jest wymagane",
        invalid_type_error: "Wynagrodzenie musi być liczbą",
      })
      .positive("Wynagrodzenie musi być większe od zera")
      .max(1000000, "Wynagrodzenie jest zbyt wysokie"),

    startYear: z
      .number({
        required_error: "Rok rozpoczęcia pracy jest wymagany",
        invalid_type_error: "Rok rozpoczęcia pracy musi być liczbą",
      })
      .int("Rok musi być liczbą całkowitą")
      .min(1950, "Rok rozpoczęcia pracy nie może być wcześniejszy niż 1950")
      .max(
        new Date().getFullYear(),
        "Rok rozpoczęcia pracy nie może być w przyszłości",
      ),

    endYear: z
      .number({
        required_error: "Planowany rok zakończenia pracy jest wymagany",
        invalid_type_error: "Rok zakończenia pracy musi być liczbą",
      })
      .int("Rok musi być liczbą całkowitą")
      .min(
        new Date().getFullYear(),
        "Rok zakończenia pracy nie może być w przeszłości",
      )
      .max(2100, "Rok zakończenia pracy jest zbyt odległy"),

    // Dane fakultatywne
    currentFunds: z
      .union([
        z.number().min(0, "Wysokość środków nie może być ujemna"),
        z.literal(""),
        z.undefined(),
      ])
      .optional()
      .transform((val) => (val === "" ? undefined : val)),

    postalCode: z
      .union([
        z
          .string()
          .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
        z.literal(""),
        z.undefined(),
      ])
      .optional()
      .transform((val) => (val === "" ? undefined : val)),

    includeSickLeave: z
      .boolean({
        invalid_type_error: "Wartość musi być prawdą lub fałszem",
      })
      .default(false),

    // Docelowa wysokość emerytury (obowiązkowe)
    targetPension: z
      .number({
        required_error: "Docelowa wysokość emerytury jest wymagana",
        invalid_type_error: "Docelowa wysokość emerytury musi być liczbą",
      })
      .min(0, "Docelowa emerytura nie może być ujemna")
      .max(100000, "Docelowa emerytura jest zbyt wysoka"),

    includeWageGrowth: z
      .boolean({
        invalid_type_error: "Wartość musi być prawdą lub fałszem",
      })
      .default(false),

    includeIndexation: z
      .boolean({
        invalid_type_error: "Wartość musi być prawdą lub fałszem",
      })
      .default(false),
  })
  .refine((data) => data.endYear > data.startYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia",
    path: ["endYear"],
  })
  .refine(
    (data) => {
      const workYears = data.endYear - data.startYear;
      const retirementAge = data.gender === "male" ? 65 : 60;
      const currentAge =
        new Date().getFullYear() - (new Date().getFullYear() - data.age);
      return workYears >= 20 || retirementAge - currentAge >= 20;
    },
    {
      message: "Okres pracy powinien wynosić co najmniej 20 lat",
      path: ["endYear"],
    },
  );

export type PensionFormData = z.infer<typeof pensionFormSchema>;
