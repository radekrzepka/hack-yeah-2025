"use client";

import type {
  SendSimulationRequestDto,
  SendSimulationResponseDto,
} from "@hackathon/shared";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
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
} from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert as AlertCircle, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sendSimulationClient } from "../../../form/_api/send-simulation";
import type { SimulationConfigDto } from "../_api/client/get-simulation-data";
import { addScenario } from "../_utils/scenario-storage";
import {
  CustomExperienceManager,
  type CustomExperiencePeriod,
} from "./controls/custom-experience-manager";
import { pensionFormSchema, type PensionFormData } from "./schema";

// Transform API config data to form format
function transformConfigToFormData(
  config: SimulationConfigDto,
): Partial<PensionFormData> {
  // Extract year from workStartDate (format: "YYYY-MM-DD")
  const workStartYear = new Date(config.workStartDate).getFullYear();

  return {
    age: config.age,
    gender: config.sex,
    contractType: config.contractType,
    salary: config.grossSalary,
    startYear: workStartYear,
    endYear: config.plannedRetirementYear,
    targetPension: config.expectedPension,
    postalCode: config.postalCode || undefined,
    currentFunds: config.currentFunds || undefined,
    includeSickLeave: config.includeSickLeave,
    includeWageGrowth: config.includeWageGrowth,
    includeIndexation: config.includeIndexation,
    customExperience: config.customExperience || [],
  };
}

// Transform form data to API format
function transformFormDataToApi(
  formData: PensionFormData,
): SendSimulationRequestDto {
  const apiData: SendSimulationRequestDto = {
    age: formData.age,
    sex: formData.gender,
    grossSalary: formData.salary,
    workStartDate: `${formData.startYear}-01-01`,
    plannedRetirementYear: formData.endYear,
    includeSickLeave: formData.includeSickLeave,
    expectedPension: formData.targetPension,
    contractType: formData.contractType,
    includeWageGrowth: formData.includeWageGrowth,
    includeIndexation: formData.includeIndexation,
  };

  // Dodaj postalCode tylko jeśli jest wypełniony
  if (formData.postalCode && formData.postalCode.trim() !== "") {
    apiData.postalCode = formData.postalCode.trim();
  }

  // Dodaj currentFunds tylko jeśli jest wypełniony
  if (formData.currentFunds !== undefined && formData.currentFunds > 0) {
    apiData.currentFunds = formData.currentFunds;
  }

  // Dodaj customExperience jeśli istnieje
  if (formData.customExperience && formData.customExperience.length > 0) {
    apiData.customExperience = formData.customExperience;
  }

  return apiData;
}

interface DashboardFormProps {
  config?: SimulationConfigDto;
  initialData?: {
    expectedPension?: number;
  };
}

export function DashboardForm({ config, initialData }: DashboardFormProps) {
  const router = useRouter();
  const [customExperience, setCustomExperience] = useState<
    Array<CustomExperiencePeriod>
  >([]);

  // Prepare default values from config or initialData
  const defaultValues = config
    ? transformConfigToFormData(config)
    : {
        targetPension: initialData?.expectedPension,
        contractType: undefined,
        includeSickLeave: false,
        includeWageGrowth: false,
        includeIndexation: false,
      };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PensionFormData>({
    resolver: zodResolver(pensionFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues,
  });

  const watchedValues = watch();

  // Update form when config changes
  useEffect(() => {
    if (config) {
      const formData = transformConfigToFormData(config);
      reset(formData);
      setCustomExperience(config.customExperience || []);
    }
  }, [config, reset]);

  const simulationMutation = useMutation({
    mutationFn: async (
      formData: PensionFormData,
    ): Promise<SendSimulationResponseDto> => {
      const apiData = transformFormDataToApi(formData);
      return sendSimulationClient(apiData);
    },
    onSuccess: (data, variables) => {
      console.log("Simulation sent successfully:", data);

      // Zapisz dane do localStorage
      addScenario({
        actualId: data.id,
        name: `Scenariusz ${new Date().toLocaleDateString("pl-PL")}`,
        description: `Symulacja dla ${variables.age}-letniego ${variables.gender === "male" ? "mężczyzny" : "kobiety"}`,
        parameters: {
          age: variables.age,
          expectedPension: variables.targetPension,
          tokenID: data.id,
          typeOfEmployment: variables.contractType,
        },
      });

      // Przekieruj na dashboard z ID symulacji
      router.push(`/dashboard/${data.id}`);
    },
    onError: (error) => {
      console.error("Simulation failed:", error);
    },
  });

  const onSubmit = (data: PensionFormData) => {
    // Add customExperience to form data
    const formDataWithExperience = {
      ...data,
      customExperience,
    };
    simulationMutation.mutate(formDataWithExperience);
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
            Aktualizuj Parametry Symulacji
          </CardTitle>
          <CardDescription id="form-description">
            Zmień parametry symulacji i zobacz nowe prognozy emerytalne
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
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium text-green-800">
                  Symulacja została wysłana pomyślnie!
                </span>
              </div>
              <p className="text-sm text-green-700">
                Przekierowujemy Cię do nowego dashboardu...
              </p>
            </div>
          )}

          {/* Błąd */}
          {simulationMutation.isError && (
            <div
              className="border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="polite"
              aria-label="Komunikat o błędzie"
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">
                  Wystąpił błąd podczas wysyłania symulacji
                </span>
              </div>
              <p className="text-sm text-red-700">
                Spróbuj ponownie lub skontaktuj się z pomocą techniczną.
              </p>
            </div>
          )}

          {/* Dane osobowe */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Dane osobowe</h3>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Wiek */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Wiek <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className={errors.age ? "border-destructive" : ""}
                  aria-invalid={errors.age ? "true" : "false"}
                  aria-describedby={errors.age ? "age-error" : undefined}
                />
                {errors.age && (
                  <p id="age-error" className="text-destructive text-xs">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Płeć */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Płeć <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.gender}
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female")
                  }
                >
                  <SelectTrigger
                    className={errors.gender ? "border-destructive" : ""}
                    aria-invalid={errors.gender ? "true" : "false"}
                    aria-describedby={
                      errors.gender ? "gender-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Wybierz płeć" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Mężczyzna</SelectItem>
                    <SelectItem value="female">Kobieta</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p id="gender-error" className="text-destructive text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informacje o pracy */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Informacje o pracy</h3>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Rodzaj umowy */}
              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-sm font-medium">
                  Rodzaj umowy <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.contractType}
                  onValueChange={(value) =>
                    setValue(
                      "contractType",
                      value as "uop" | "b2b" | "zlecenie" | "dzielo",
                    )
                  }
                >
                  <SelectTrigger
                    className={errors.contractType ? "border-destructive" : ""}
                    aria-invalid={errors.contractType ? "true" : "false"}
                    aria-describedby={
                      errors.contractType ? "contractType-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Wybierz rodzaj umowy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uop">Umowa o pracę</SelectItem>
                    <SelectItem value="b2b">B2B</SelectItem>
                    <SelectItem value="zlecenie">Umowa zlecenie</SelectItem>
                    <SelectItem value="dzielo">Umowa o dzieło</SelectItem>
                  </SelectContent>
                </Select>
                {errors.contractType && (
                  <p
                    id="contractType-error"
                    className="text-destructive text-xs"
                  >
                    {errors.contractType.message}
                  </p>
                )}
              </div>

              {/* Wynagrodzenie */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Miesięczne wynagrodzenie brutto (zł){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="salary"
                  type="number"
                  step="0.01"
                  {...register("salary", { valueAsNumber: true })}
                  className={errors.salary ? "border-destructive" : ""}
                  aria-invalid={errors.salary ? "true" : "false"}
                  aria-describedby={errors.salary ? "salary-error" : undefined}
                />
                {errors.salary && (
                  <p id="salary-error" className="text-destructive text-xs">
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Rok rozpoczęcia pracy */}
              <div className="space-y-2">
                <Label htmlFor="startYear" className="text-sm font-medium">
                  Rok rozpoczęcia pracy{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startYear"
                  type="number"
                  {...register("startYear", { valueAsNumber: true })}
                  className={errors.startYear ? "border-destructive" : ""}
                  aria-invalid={errors.startYear ? "true" : "false"}
                  aria-describedby={
                    errors.startYear ? "startYear-error" : undefined
                  }
                />
                {errors.startYear && (
                  <p id="startYear-error" className="text-destructive text-xs">
                    {errors.startYear.message}
                  </p>
                )}
              </div>

              {/* Planowany rok zakończenia pracy */}
              <div className="space-y-2">
                <Label htmlFor="endYear" className="text-sm font-medium">
                  Planowany rok zakończenia pracy{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endYear"
                  type="number"
                  {...register("endYear", { valueAsNumber: true })}
                  className={errors.endYear ? "border-destructive" : ""}
                  aria-invalid={errors.endYear ? "true" : "false"}
                  aria-describedby={
                    errors.endYear ? "endYear-error" : undefined
                  }
                />
                {errors.endYear && (
                  <p id="endYear-error" className="text-destructive text-xs">
                    {errors.endYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Parametry emerytalne */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Parametry emerytalne</h3>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Oczekiwana wysokość emerytury */}
              <div className="space-y-2">
                <Label htmlFor="targetPension" className="text-sm font-medium">
                  Oczekiwana wysokość emerytury (zł){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="targetPension"
                  type="number"
                  step="0.01"
                  {...register("targetPension", { valueAsNumber: true })}
                  className={errors.targetPension ? "border-destructive" : ""}
                  aria-invalid={errors.targetPension ? "true" : "false"}
                  aria-describedby={
                    errors.targetPension ? "targetPension-error" : undefined
                  }
                />
                {errors.targetPension && (
                  <p
                    id="targetPension-error"
                    className="text-destructive text-xs"
                  >
                    {errors.targetPension.message}
                  </p>
                )}
              </div>

              {/* Kod pocztowy */}
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-medium">
                  Kod pocztowy
                </Label>
                <Input
                  id="postalCode"
                  placeholder="00-000"
                  {...register("postalCode")}
                  className={errors.postalCode ? "border-destructive" : ""}
                  aria-invalid={errors.postalCode ? "true" : "false"}
                  aria-describedby={
                    errors.postalCode ? "postalCode-error" : undefined
                  }
                />
                {errors.postalCode && (
                  <p id="postalCode-error" className="text-destructive text-xs">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Aktualne środki */}
            <div className="space-y-2">
              <Label htmlFor="currentFunds" className="text-sm font-medium">
                Aktualne środki w ZUS (zł)
              </Label>
              <Input
                id="currentFunds"
                type="number"
                step="0.01"
                {...register("currentFunds", { valueAsNumber: true })}
                className={errors.currentFunds ? "border-destructive" : ""}
                aria-invalid={errors.currentFunds ? "true" : "false"}
                aria-describedby={
                  errors.currentFunds ? "currentFunds-error" : undefined
                }
              />
              {errors.currentFunds && (
                <p id="currentFunds-error" className="text-destructive text-xs">
                  {errors.currentFunds.message}
                </p>
              )}
            </div>
          </div>

          {/* Opcje zaawansowane */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Opcje zaawansowane</h3>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-4">
              {/* Uwzględnij okresy choroby */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="includeSickLeave"
                    className="text-sm font-medium"
                  >
                    Uwzględnij okresy choroby
                  </Label>
                </div>
                <Switch
                  id="includeSickLeave"
                  checked={watchedValues.includeSickLeave}
                  onCheckedChange={(checked) =>
                    setValue("includeSickLeave", checked)
                  }
                />
              </div>

              {/* Uwzględnij wzrost wynagrodzenia */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="includeWageGrowth"
                    className="text-sm font-medium"
                  >
                    Uwzględnij wzrost wynagrodzenia
                  </Label>
                </div>
                <Switch
                  id="includeWageGrowth"
                  checked={watchedValues.includeWageGrowth}
                  onCheckedChange={(checked) =>
                    setValue("includeWageGrowth", checked)
                  }
                />
              </div>

              {/* Uwzględnij waloryzację świadczeń */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="includeIndexation"
                    className="text-sm font-medium"
                  >
                    Uwzględnij waloryzację świadczeń
                  </Label>
                </div>
                <Switch
                  id="includeIndexation"
                  checked={watchedValues.includeIndexation}
                  onCheckedChange={(checked) =>
                    setValue("includeIndexation", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Dodatkowe okresy doświadczenia */}
          <div className="space-y-6">
            <CustomExperienceManager
              value={customExperience}
              onChange={setCustomExperience}
            />
          </div>

          {/* Przycisk submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || simulationMutation.isPending}
              className="w-full md:w-auto"
              size="lg"
            >
              {isSubmitting || simulationMutation.isPending
                ? "Wysyłanie..."
                : "Aktualizuj Symulację"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
