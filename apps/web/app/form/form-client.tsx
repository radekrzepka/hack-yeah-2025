"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert as AlertCircle, Calculator, Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSimulation } from "./_hooks/use-simulation";
import { FormError } from "./form-error";
import { pensionFormSchema, type PensionFormData } from "./schema";

export function FormClient() {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
      includeSickLeave: false,
      includeWageGrowth: false,
      includeIndexation: false,
    },
  });

  const watchedValues = watch();
  const simulationMutation = useSimulation();

  const onSubmit = (data: PensionFormData) => {
    setHasAttemptedSubmit(true);
    simulationMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calculator className="text-primary h-5 w-5" />
            Formularz prognozy emerytalnej
          </CardTitle>
          <CardDescription>
            Wypełnij poniższe pola, aby otrzymać orientacyjną prognozę Twojej
            przyszłej emerytury
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Sukces */}
          {simulationMutation.isSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs text-white">✓</span>
                </div>
                <h4 className="text-sm font-medium text-green-800">
                  Dane wysłane pomyślnie!
                </h4>
              </div>
              <p className="text-sm text-green-700">
                Twoja prognoza emerytalna została przesłana. Otrzymasz wyniki na
                podany adres email.
              </p>
            </div>
          )}

          {/* Błędy API */}
          {simulationMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
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
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h4 className="text-sm font-medium text-red-800">
                  Proszę poprawić następujące błędy:
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="flex items-center gap-2">
                    <span className="text-red-500">•</span>
                    <span>{error?.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm">
                  1
                </span>
                Dane obowiązkowe
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Wiek</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="np. 35"
                    min="18"
                    max="100"
                    {...register("age", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.age?.message}
                    showError={hasAttemptedSubmit || touchedFields.age}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Płeć</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("gender", value as "male" | "female")
                    }
                  >
                    <SelectTrigger id="gender">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">
                    Wysokość wynagrodzenia brutto (PLN/miesiąc)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="np. 8000"
                    min="0"
                    step="100"
                    {...register("salary", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.salary?.message}
                    showError={hasAttemptedSubmit || touchedFields.salary}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startYear">Rok rozpoczęcia pracy</Label>
                  <Input
                    id="startYear"
                    type="number"
                    placeholder="np. 2010"
                    min="1950"
                    max={new Date().getFullYear()}
                    {...register("startYear", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.startYear?.message}
                    showError={hasAttemptedSubmit || touchedFields.startYear}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="endYear">
                      Planowany rok zakończenia aktywności zawodowej
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground h-4 w-4 cursor-help" />
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
                    {...register("endYear", { valueAsNumber: true })}
                  />
                  <FormError
                    error={errors.endYear?.message}
                    showError={hasAttemptedSubmit || touchedFields.endYear}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="bg-secondary text-secondary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm">
                  2
                </span>
                Dane fakultatywne
              </h3>

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
                    {...register("currentFunds", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  />
                  <FormError
                    error={errors.currentFunds?.message}
                    showError={hasAttemptedSubmit || touchedFields.currentFunds}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kod pocztowy</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="np. 00-001"
                    maxLength={6}
                    {...register("postalCode")}
                  />
                  <FormError
                    error={errors.postalCode?.message}
                    showError={hasAttemptedSubmit || touchedFields.postalCode}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sickLeave"
                      checked={watchedValues.includeSickLeave}
                      onCheckedChange={(checked: boolean) =>
                        setValue("includeSickLeave", checked)
                      }
                    />
                    <Label
                      htmlFor="sickLeave"
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Uwzględniaj możliwość zwolnień lekarskich
                      {watchedValues.includeSickLeave && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
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
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="bg-accent text-accent-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm">
                  3
                </span>
                Dodatkowe preferencje
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="targetPension">
                    Jaką wysokość emerytury chciałbyś osiągnąć? (PLN)
                  </Label>
                  <Input
                    id="targetPension"
                    type="number"
                    placeholder="np. 5000"
                    min="0"
                    step="100"
                    {...register("targetPension", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  />
                  <FormError
                    error={errors.targetPension?.message}
                    showError={
                      hasAttemptedSubmit || touchedFields.targetPension
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wageGrowth"
                      checked={watchedValues.includeWageGrowth}
                      onCheckedChange={(checked: boolean) =>
                        setValue("includeWageGrowth", checked)
                      }
                    />
                    <Label
                      htmlFor="wageGrowth"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Uwzględniaj prognozowany wzrost wynagrodzeń (NBP/GUS)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indexation"
                      checked={watchedValues.includeIndexation}
                      onCheckedChange={(checked: boolean) =>
                        setValue("includeIndexation", checked)
                      }
                    />
                    <Label
                      htmlFor="indexation"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Uwzględniaj indeksację świadczeń po przejściu na emeryturę
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-accent/50 bg-accent/5 flex items-start gap-3 rounded-lg border p-4">
            <AlertCircle className="text-accent-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
            <p className="text-accent-foreground text-sm">
              Dane mają charakter orientacyjny i nie stanowią oficjalnej
              prognozy ZUS.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isSubmitting || simulationMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-6 text-lg font-semibold"
              size="lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              {simulationMutation.isPending
                ? "Wysyłanie danych..."
                : simulationMutation.isSuccess
                  ? "Dane wysłane pomyślnie!"
                  : simulationMutation.isError
                    ? "Błąd wysyłania - spróbuj ponownie"
                    : "Zaprognozuj moją przyszłą emeryturę"}
            </Button>

            {simulationMutation.isError && (
              <Button
                type="button"
                variant="outline"
                onClick={() => simulationMutation.reset()}
                className="w-full"
              >
                Spróbuj ponownie
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
