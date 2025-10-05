"use client";

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hackathon/ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

// Schemat walidacji Zod dla pojedynczego okresu
export const customExperiencePeriodSchema = z
  .object({
    yearStart: z
      .number({
        required_error: "Rok rozpoczęcia jest wymagany",
        invalid_type_error: "Rok rozpoczęcia musi być liczbą",
      })
      .int("Rok musi być liczbą całkowitą")
      .min(1950, "Rok rozpoczęcia nie może być wcześniejszy niż 1950")
      .max(new Date().getFullYear() + 50, "Rok rozpoczęcia jest zbyt odległy"),

    yearEnd: z
      .number({
        required_error: "Rok zakończenia jest wymagany",
        invalid_type_error: "Rok zakończenia musi być liczbą",
      })
      .int("Rok musi być liczbą całkowitą")
      .min(1950, "Rok zakończenia nie może być wcześniejszy niż 1950")
      .max(2100, "Rok zakończenia jest zbyt odległy"),

    monthlySalary: z
      .number({
        required_error: "Wynagrodzenie miesięczne jest wymagane",
        invalid_type_error: "Wynagrodzenie musi być liczbą",
      })
      .positive("Wynagrodzenie musi być większe od zera")
      .max(1000000, "Wynagrodzenie jest zbyt wysokie"),

    contractType: z.enum(["uop", "b2b", "zlecenie", "dzielo"], {
      required_error: "Rodzaj umowy jest wymagany",
      invalid_type_error: "Nieprawidłowy rodzaj umowy",
    }),
  })
  .refine((data) => data.yearEnd > data.yearStart, {
    message: "Rok zakończenia musi być późniejszy niż rok rozpoczęcia",
    path: ["yearEnd"],
  });

// Funkcja walidacji zazębiania się okresów
export const validateNoOverlappingPeriods = (
  periods: Array<CustomExperiencePeriod>,
): Array<ValidationError> => {
  const errors: Array<ValidationError> = [];

  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const period1 = periods[i];
      const period2 = periods[j];

      // Sprawdź czy oba okresy istnieją
      if (!period1 || !period2) continue;

      // Sprawdź czy okresy się zazębiają
      const overlap =
        period1.yearStart <= period2.yearEnd &&
        period1.yearEnd >= period2.yearStart;

      if (overlap) {
        errors.push({
          index: i,
          field: "yearStart",
          message: `Okres zazębia się z okresem ${j + 1}`,
        });
        errors.push({
          index: j,
          field: "yearStart",
          message: `Okres zazębia się z okresem ${i + 1}`,
        });
      }
    }
  }

  return errors;
};

// Schemat walidacji dla tablicy okresów
export const customExperienceArraySchema = z.array(
  customExperiencePeriodSchema,
);

export interface CustomExperiencePeriod {
  yearStart: number;
  yearEnd: number;
  monthlySalary: number;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
}

interface CustomExperienceManagerProps {
  value?: Array<CustomExperiencePeriod>;
  onChange?: (periods: Array<CustomExperiencePeriod>) => void;
}

interface ValidationError {
  index: number;
  field: string;
  message: string;
}

export function CustomExperienceManager({
  value = [],
  onChange,
}: CustomExperienceManagerProps) {
  const [periods, setPeriods] = useState<Array<CustomExperiencePeriod>>(value);
  const [validationErrors, setValidationErrors] = useState<
    Array<ValidationError>
  >([]);

  // Sync with parent component
  useEffect(() => {
    setPeriods(value);
    validatePeriods(value);
  }, [value]);

  // Validate all periods
  const validatePeriods = (
    periodsToValidate: Array<CustomExperiencePeriod>,
  ) => {
    const errors: Array<ValidationError> = [];

    // Walidacja pojedynczych okresów
    periodsToValidate.forEach((period, index) => {
      const result = customExperiencePeriodSchema.safeParse(period);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          errors.push({
            index,
            field: error.path.join("."),
            message: error.message,
          });
        });
      }
    });

    // Walidacja zazębiania się okresów
    const overlapErrors = validateNoOverlappingPeriods(periodsToValidate);
    errors.push(...overlapErrors);

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Get error message for specific field
  const getFieldError = (index: number, field: string) => {
    return validationErrors.find(
      (error) => error.index === index && error.field === field,
    )?.message;
  };

  // Notify parent component of changes
  const handlePeriodsChange = (newPeriods: Array<CustomExperiencePeriod>) => {
    setPeriods(newPeriods);
    validatePeriods(newPeriods);
    onChange?.(newPeriods);
  };

  const addPeriod = () => {
    const newPeriod: CustomExperiencePeriod = {
      yearStart: new Date().getFullYear(),
      yearEnd: new Date().getFullYear() + 1,
      monthlySalary: 5000,
      contractType: "uop",
    };
    handlePeriodsChange([...periods, newPeriod]);
  };

  const removePeriod = (index: number) => {
    const updatedPeriods = periods.filter((_, i) => i !== index);
    handlePeriodsChange(updatedPeriods);
  };

  const updatePeriod = (
    index: number,
    field: keyof CustomExperiencePeriod,
    value: CustomExperiencePeriod[keyof CustomExperiencePeriod],
  ) => {
    const updatedPeriods = [...periods];
    const currentPeriod = updatedPeriods[index];
    if (currentPeriod) {
      updatedPeriods[index] = { ...currentPeriod, [field]: value };
      handlePeriodsChange(updatedPeriods);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">
            Dodatkowe okresy doświadczenia
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Dodaj okresy pracy z różnymi wynagrodzeniami i typami umów
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPeriod}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Dodaj okres
        </Button>
      </div>

      <CardContent className="space-y-4">
        {periods.length === 0 ? (
          <div></div>
        ) : (
          <div className="space-y-6">
            {periods.map((period, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Okres {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePeriod(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Rok rozpoczęcia */}
                    <div className="space-y-2">
                      <Label htmlFor={`periods.${index}.yearStart`}>
                        Rok rozpoczęcia *
                      </Label>
                      <Input
                        id={`periods.${index}.yearStart`}
                        type="number"
                        value={period.yearStart || ""}
                        onChange={(e) =>
                          updatePeriod(
                            index,
                            "yearStart",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className={
                          getFieldError(index, "yearStart")
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {getFieldError(index, "yearStart") && (
                        <p className="text-destructive text-sm">
                          {getFieldError(index, "yearStart")}
                        </p>
                      )}
                    </div>

                    {/* Rok zakończenia */}
                    <div className="space-y-2">
                      <Label htmlFor={`periods.${index}.yearEnd`}>
                        Rok zakończenia *
                      </Label>
                      <Input
                        id={`periods.${index}.yearEnd`}
                        type="number"
                        value={period.yearEnd || ""}
                        onChange={(e) =>
                          updatePeriod(
                            index,
                            "yearEnd",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className={
                          getFieldError(index, "yearEnd")
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {getFieldError(index, "yearEnd") && (
                        <p className="text-destructive text-sm">
                          {getFieldError(index, "yearEnd")}
                        </p>
                      )}
                    </div>

                    {/* Wynagrodzenie miesięczne */}
                    <div className="space-y-2">
                      <Label htmlFor={`periods.${index}.monthlySalary`}>
                        Wynagrodzenie miesięczne (zł) *
                      </Label>
                      <Input
                        id={`periods.${index}.monthlySalary`}
                        type="number"
                        step="0.01"
                        value={period.monthlySalary || ""}
                        onChange={(e) =>
                          updatePeriod(
                            index,
                            "monthlySalary",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={
                          getFieldError(index, "monthlySalary")
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {getFieldError(index, "monthlySalary") && (
                        <p className="text-destructive text-sm">
                          {getFieldError(index, "monthlySalary")}
                        </p>
                      )}
                    </div>

                    {/* Rodzaj umowy */}
                    <div className="space-y-2">
                      <Label htmlFor={`periods.${index}.contractType`}>
                        Rodzaj umowy *
                      </Label>
                      <Select
                        value={period.contractType || ""}
                        onValueChange={(value) =>
                          updatePeriod(
                            index,
                            "contractType",
                            value as CustomExperiencePeriod["contractType"],
                          )
                        }
                      >
                        <SelectTrigger
                          className={
                            getFieldError(index, "contractType")
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Wybierz typ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uop">Umowa o pracę</SelectItem>
                          <SelectItem value="b2b">B2B</SelectItem>
                          <SelectItem value="zlecenie">
                            Umowa zlecenie
                          </SelectItem>
                          <SelectItem value="dzielo">Umowa o dzieło</SelectItem>
                        </SelectContent>
                      </Select>
                      {getFieldError(index, "contractType") && (
                        <p className="text-destructive text-sm">
                          {getFieldError(index, "contractType")}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}
