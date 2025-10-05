"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert as AlertCircle, Calculator, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSimulation } from "./_hooks/use-simulation";
import { FormError } from "./form-error";
import { pensionFormSchema, type PensionFormData } from "./schema";

export function FormClient() {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    watch,
  } = useForm<PensionFormData>({
    resolver: zodResolver(pensionFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      contractType: undefined,
      includeSickLeave: false,
      includeWageGrowth: false,
      includeIndexation: false,
    },
  });

  const watchedValues = watch();
  const simulationMutation = useSimulation();

  // Pobierz preferowaną wysokość emerytury z URL
  const preferredPensionFromUrl = searchParams.get("target");

  // Prefill formularz wartością z URL
  useEffect(() => {
    if (preferredPensionFromUrl) {
      const pensionValue = Number(preferredPensionFromUrl);
      if (!isNaN(pensionValue) && pensionValue > 0) {
        setValue("targetPension", pensionValue);
      }
    }
  }, [preferredPensionFromUrl, setValue]);

  const onSubmit = (data: PensionFormData) => {
    setHasAttemptedSubmit(true);
    simulationMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="form-title"
      aria-describedby="form-description"
      role="form"
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle
            className="text-foreground flex items-center gap-2"
            id="form-title"
          >
            <Calculator className="text-primary h-5 w-5" aria-hidden="true" />
            Formularz prognozy emerytalnej
          </CardTitle>
          <CardDescription id="form-description">
            Wypełnij poniższe pola, aby otrzymać orientacyjną prognozę Twojej
            przyszłej emerytury
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Sukces */}
          {simulationMutation.isSuccess && (
            <div
              className="border border-green-200 bg-green-50 p-4"
              role="status"
              aria-live="polite"
              aria-label="Komunikat o sukcesie"
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"
                  aria-hidden="true"
                >
                  <span className="text-xs text-white">✓</span>
                </div>
                <h4 className="text-sm font-medium text-green-800">
                  Dane wysłane pomyślnie!
                </h4>
              </div>
            </div>
          )}

          {/* Błędy API */}
          {simulationMutation.isError && (
            <div
              className="border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="assertive"
              aria-label="Komunikat o błędzie"
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle
                  className="h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                <h4 className="text-sm font-medium text-red-800">
                  Błąd wysyłania danych
                </h4>
              </div>
              <p className="text-sm text-red-700">
                {simulationMutation.error?.message ||
                  "Wystąpił nieoczekiwany błąd. Spróbuj ponownie."}
              </p>
            </div>
          )}

          {/* Błędy formularza */}
          {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
            <div
              className="border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="polite"
              aria-label="Lista błędów formularza"
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle
                  className="h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                <h4 className="text-sm font-medium text-red-800">
                  Proszę poprawić następujące błędy:
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-red-700" role="list">
                {Object.entries(errors).map(([field, error]) => (
                  <li
                    key={field}
                    className="flex items-center gap-2"
                    role="listitem"
                  >
                    <span className="text-red-500" aria-hidden="true">
                      •
                    </span>
                    <span>{error?.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            <fieldset>
              <legend className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span
                  className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm"
                  aria-hidden="true"
                >
                  1
                </span>
                Docelowa wysokość emerytury
              </legend>

              <div className="space-y-2">
                <Label htmlFor="targetPension">
                  Jaką wysokość emerytury chciałbyś osiągnąć? (PLN) *
                </Label>
                <Input
                  id="targetPension"
                  type="number"
                  placeholder="np. 5000"
                  min="0"
                  step="100"
                  required
                  aria-required="true"
                  aria-invalid={errors.targetPension ? "true" : "false"}
                  aria-describedby={
                    errors.targetPension ? "targetPension-error" : undefined
                  }
                  aria-label="Docelowa wysokość emerytury w PLN (wymagane pole)"
                  {...register("targetPension", { valueAsNumber: true })}
                />
                <FormError
                  error={errors.targetPension?.message}
                  showError={hasAttemptedSubmit || touchedFields.targetPension}
                  id="targetPension-error"
                />
              </div>
            </fieldset>

            <Separator />

            <fieldset>
              <legend className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span
                  className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm"
                  aria-hidden="true"
                >
                  2
                </span>
                Dane obowiązkowe
              </legend>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Wiek *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="np. 35"
                    min="18"
                    max="100"
                    required
                    aria-required="true"
                    aria-invalid={errors.age ? "true" : "false"}
                    aria-describedby={errors.age ? "age-error" : undefined}
                    aria-label="Wiek w latach (wymagane pole)"
                    {...register("age", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.age?.message}
                    showError={hasAttemptedSubmit || touchedFields.age}
                    id="age-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Płeć *</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("gender", value as "male" | "female")
                    }
                    required
                  >
                    <SelectTrigger
                      id="gender"
                      aria-required="true"
                      aria-invalid={errors.gender ? "true" : "false"}
                      aria-describedby={
                        errors.gender ? "gender-error" : undefined
                      }
                      aria-label="Wybierz płeć (wymagane pole)"
                    >
                      <SelectValue placeholder="Wybierz płeć" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Kobieta</SelectItem>
                      <SelectItem value="male">Mężczyzna</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError
                    error={errors.gender?.message}
                    showError={hasAttemptedSubmit || touchedFields.gender}
                    id="gender-error"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="contractType">Rodzaj umowy *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className="text-muted-foreground h-4 w-4 cursor-help"
                            aria-label="Informacja o rodzajach umów"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs space-y-2">
                            <p>
                              <strong>UoP:</strong> Umowa o pracę - pełne
                              składki ZUS
                            </p>
                            <p>
                              <strong>B2B:</strong> Umowa B2B - niższe składki
                            </p>
                            <p>
                              <strong>Zlecenie:</strong> Umowa zlecenie -
                              opcjonalne składki
                            </p>
                            <p>
                              <strong>Dzieło:</strong> Umowa o dzieło - bez
                              składek ZUS
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "contractType",
                        value as "uop" | "b2b" | "zlecenie" | "dzielo",
                      )
                    }
                    required
                  >
                    <SelectTrigger
                      id="contractType"
                      aria-required="true"
                      aria-invalid={errors.contractType ? "true" : "false"}
                      aria-describedby={
                        errors.contractType ? "contractType-error" : undefined
                      }
                      aria-label="Wybierz rodzaj umowy (wymagane pole)"
                    >
                      <SelectValue placeholder="Wybierz rodzaj umowy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uop">Umowa o pracę (UoP)</SelectItem>
                      <SelectItem value="b2b">Umowa B2B</SelectItem>
                      <SelectItem value="zlecenie">Umowa zlecenie</SelectItem>
                      <SelectItem value="dzielo">Umowa o dzieło</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError
                    error={errors.contractType?.message}
                    showError={hasAttemptedSubmit || touchedFields.contractType}
                    id="contractType-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">
                    Wysokość wynagrodzenia brutto (PLN/miesiąc) *
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="np. 8000"
                    min="0"
                    step="100"
                    required
                    aria-required="true"
                    aria-invalid={errors.salary ? "true" : "false"}
                    aria-describedby={
                      errors.salary ? "salary-error" : undefined
                    }
                    aria-label="Wysokość wynagrodzenia brutto w PLN na miesiąc (wymagane pole)"
                    {...register("salary", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.salary?.message}
                    showError={hasAttemptedSubmit || touchedFields.salary}
                    id="salary-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startYear">Rok rozpoczęcia pracy *</Label>
                  <Input
                    id="startYear"
                    type="number"
                    placeholder="np. 2010"
                    min="1950"
                    max={new Date().getFullYear()}
                    required
                    aria-required="true"
                    aria-invalid={errors.startYear ? "true" : "false"}
                    aria-describedby={
                      errors.startYear ? "startYear-error" : undefined
                    }
                    aria-label="Rok rozpoczęcia pracy (wymagane pole)"
                    {...register("startYear", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.startYear?.message}
                    showError={hasAttemptedSubmit || touchedFields.startYear}
                    id="startYear-error"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="endYear">
                      Planowany rok zakończenia aktywności zawodowej *
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className="text-muted-foreground h-4 w-4 cursor-help"
                            aria-label="Pomoc: Domyślnie rok osiągnięcia wieku emerytalnego"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Domyślnie rok osiągnięcia wieku emerytalnego
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="endYear"
                    type="number"
                    placeholder="np. 2055"
                    min={new Date().getFullYear()}
                    max="2100"
                    required
                    aria-required="true"
                    aria-invalid={errors.endYear ? "true" : "false"}
                    aria-describedby={
                      errors.endYear ? "endYear-error" : undefined
                    }
                    aria-label="Planowany rok zakończenia aktywności zawodowej (wymagane pole)"
                    {...register("endYear", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.endYear?.message}
                    showError={hasAttemptedSubmit || touchedFields.endYear}
                    id="endYear-error"
                  />
                </div>
              </div>
            </fieldset>

            <Separator />

            <fieldset>
              <legend className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span
                  className="bg-secondary text-secondary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm"
                  aria-hidden="true"
                >
                  3
                </span>
                Dane fakultatywne
              </legend>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentFunds">
                    Wysokość zgromadzonych środków w ZUS (PLN)
                  </Label>
                  <Input
                    id="currentFunds"
                    type="number"
                    placeholder="np. 150000"
                    min="0"
                    step="1000"
                    aria-invalid={errors.currentFunds ? "true" : "false"}
                    aria-describedby={
                      errors.currentFunds ? "currentFunds-error" : undefined
                    }
                    {...register("currentFunds", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.currentFunds?.message}
                    showError={hasAttemptedSubmit || touchedFields.currentFunds}
                    id="currentFunds-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kod pocztowy</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="np. 00-001"
                    maxLength={6}
                    aria-invalid={errors.postalCode ? "true" : "false"}
                    aria-describedby={
                      errors.postalCode ? "postalCode-error" : undefined
                    }
                    {...register("postalCode")}
                  />
                  <FormError
                    error={errors.postalCode?.message}
                    showError={hasAttemptedSubmit || touchedFields.postalCode}
                    id="postalCode-error"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="sickLeave"
                      className="flex items-center gap-2 text-sm font-medium leading-none"
                    >
                      Uwzględniaj możliwość zwolnień lekarskich
                      {watchedValues.includeSickLeave && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info
                                className="text-muted-foreground h-4 w-4 cursor-help"
                                aria-label="Informacja o zwolnieniach lekarskich"
                              />
                            </TooltipTrigger>
                            <TooltipContent id="sickLeave-info">
                              <p className="max-w-xs">
                                Średni czas zwolnień lekarskich w Polsce to ok.
                                14 dni rocznie. Może to obniżyć przyszłe
                                świadczenie.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </Label>
                    <Switch
                      id="sickLeave"
                      checked={watchedValues.includeSickLeave}
                      onCheckedChange={(checked: boolean) =>
                        setValue("includeSickLeave", checked)
                      }
                      aria-describedby={
                        watchedValues.includeSickLeave
                          ? "sickLeave-info"
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <Separator />

            <fieldset>
              <legend className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span
                  className="bg-accent text-accent-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm"
                  aria-hidden="true"
                >
                  4
                </span>
                Dodatkowe preferencje
              </legend>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="wageGrowth"
                    className="text-sm font-medium leading-none"
                  >
                    Uwzględniaj prognozowany wzrost wynagrodzeń (NBP/GUS)
                  </Label>
                  <Switch
                    id="wageGrowth"
                    checked={watchedValues.includeWageGrowth}
                    onCheckedChange={(checked: boolean) =>
                      setValue("includeWageGrowth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="indexation"
                    className="text-sm font-medium leading-none"
                  >
                    Uwzględniaj indeksację świadczeń po przejściu na emeryturę
                  </Label>
                  <Switch
                    id="indexation"
                    checked={watchedValues.includeIndexation}
                    onCheckedChange={(checked: boolean) =>
                      setValue("includeIndexation", checked)
                    }
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div
            className="border-accent/50 bg-accent/5 flex items-start gap-3 border p-4"
            role="note"
            aria-label="Informacja prawna"
          >
            <AlertCircle
              className="text-accent-foreground mt-0.5 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-accent-foreground text-sm">
              Dane mają charakter orientacyjny i nie stanowią oficjalnej
              prognozy ZUS.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full space-y-2">
            <Button
              type="submit"
              disabled={isSubmitting || simulationMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mx-auto w-full py-6 text-lg font-semibold"
              size="lg"
              aria-describedby="form-description"
            >
              <Calculator className="mr-2 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Główny przycisk formularza: </span>
              {simulationMutation.isPending
                ? "Wysyłanie..."
                : simulationMutation.isSuccess
                  ? "Wysłano!"
                  : simulationMutation.isError
                    ? "Błąd - spróbuj ponownie"
                    : "Zaprognozuj"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
