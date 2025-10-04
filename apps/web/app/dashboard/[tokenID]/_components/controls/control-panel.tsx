"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hackathon/ui";
import { Label } from "@hackathon/ui";
import { Slider } from "@hackathon/ui";
import { Input } from "@hackathon/ui";
import { Switch } from "@hackathon/ui";
import { Button } from "@hackathon/ui";
import {
  Settings2,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@hackathon/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@hackathon/ui";
// Zod schema for validation
const earningsAdjustmentSchema = z.object({
  id: z.string(),
  yearStart: z.number().min(1900).max(2100),
  yearEnd: z.number().min(1900).max(2100),
  amount: z.number().min(0),
});

const pensionSettingsSchema = z.object({
  retirementAge: z.number().min(60).max(75),
  monthlySalary: z.number().min(0).max(100000),
  salaryGrowthRate: z.number().min(0).max(20),
  includeIllnessPeriods: z.boolean(),
  currentAge: z.number().min(18).max(100),
  earningsAdjustments: z.array(earningsAdjustmentSchema),
});

type PensionSettingsForm = z.infer<typeof pensionSettingsSchema>;
type EarningsAdjustment = z.infer<typeof earningsAdjustmentSchema>;

import { useUpdatePensionSettings } from "../../_hooks/use-update-pension-settings";

export function ControlPanel() {
  const { mutate: updateSettings, isPending } = useUpdatePensionSettings();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PensionSettingsForm>({
    resolver: zodResolver(pensionSettingsSchema),
    defaultValues: {
      retirementAge: 67,
      monthlySalary: 5000,
      salaryGrowthRate: 3,
      includeIllnessPeriods: false,
      currentAge: 25,
      earningsAdjustments: [],
    },
  });

  const watchedValues = watch();
  const [isAddAdjustmentOpen, setIsAddAdjustmentOpen] = useState(false);
  const [newAdjustment, setNewAdjustment] = useState({
    yearStart: new Date().getFullYear(),
    yearEnd: new Date().getFullYear() + 1,
    amount: watchedValues.monthlySalary,
  });

  const onSubmit = (data: PensionSettingsForm) => {
    updateSettings(data);
  };

  const handleAddAdjustment = () => {
    const adjustment: EarningsAdjustment = {
      id: Date.now().toString(),
      ...newAdjustment,
    };
    const currentAdjustments = watchedValues.earningsAdjustments;
    setValue("earningsAdjustments", [...currentAdjustments, adjustment]);
    setNewAdjustment({
      yearStart: new Date().getFullYear(),
      yearEnd: new Date().getFullYear() + 1,
      amount: watchedValues.monthlySalary,
    });
    setIsAddAdjustmentOpen(false);
  };

  const handleRemoveAdjustment = (id: string) => {
    const currentAdjustments = watchedValues.earningsAdjustments;
    setValue(
      "earningsAdjustments",
      currentAdjustments.filter((adj) => adj.id !== id),
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Panel Kontrolny
          </CardTitle>
          <CardDescription>
            Dostosuj parametry symulacji emerytalnej
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="basic-params">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Podstawowe Parametry
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retirement-age" className="text-sm">
                      Wiek emerytalny: {watchedValues.retirementAge} lat
                    </Label>
                    <Slider
                      id="retirement-age"
                      min={60}
                      max={75}
                      step={1}
                      value={[watchedValues.retirementAge]}
                      onValueChange={(value) =>
                        setValue(
                          "retirementAge",
                          value[0] ?? watchedValues.retirementAge,
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-salary" className="text-sm">
                      Miesięczne wynagrodzenie
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="monthly-salary"
                        type="number"
                        {...register("monthlySalary", { valueAsNumber: true })}
                        className="flex-1"
                      />
                      <span className="text-muted-foreground text-sm">zł</span>
                    </div>
                    {errors.monthlySalary && (
                      <p className="text-destructive text-xs">
                        {errors.monthlySalary.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary-growth" className="text-sm">
                      Roczny wzrost wynagrodzenia:{" "}
                      {watchedValues.salaryGrowthRate}%
                    </Label>
                    <Slider
                      id="salary-growth"
                      min={0}
                      max={10}
                      step={0.5}
                      value={[watchedValues.salaryGrowthRate]}
                      onValueChange={(value) =>
                        setValue(
                          "salaryGrowthRate",
                          value[0] ?? watchedValues.salaryGrowthRate,
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advanced-params">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Zaawansowane Parametry
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="illness-periods" className="text-sm">
                      Uwzględnij okresy choroby
                    </Label>
                    <Switch
                      id="illness-periods"
                      checked={watchedValues.includeIllnessPeriods}
                      onCheckedChange={(checked) =>
                        setValue("includeIllnessPeriods", checked)
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="earnings-adjustments">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Dostosowania Zarobków
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    {watchedValues.earningsAdjustments.map((adjustment) => (
                      <div
                        key={adjustment.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="text-sm">
                          <div className="font-medium">
                            {adjustment.yearStart} - {adjustment.yearEnd}
                          </div>
                          <div className="text-muted-foreground">
                            {adjustment.amount.toLocaleString()} zł/miesiąc
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdjustment(adjustment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Dialog
                      open={isAddAdjustmentOpen}
                      onOpenChange={setIsAddAdjustmentOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Dodaj Dostosowanie
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Dodaj Dostosowanie Zarobków</DialogTitle>
                          <DialogDescription>
                            Określ okres i wysokość zarobków dla konkretnych lat
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="year-start">
                                Rok rozpoczęcia
                              </Label>
                              <Input
                                id="year-start"
                                type="number"
                                value={newAdjustment.yearStart}
                                onChange={(e) =>
                                  setNewAdjustment({
                                    ...newAdjustment,
                                    yearStart: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="year-end">Rok zakończenia</Label>
                              <Input
                                id="year-end"
                                type="number"
                                value={newAdjustment.yearEnd}
                                onChange={(e) =>
                                  setNewAdjustment({
                                    ...newAdjustment,
                                    yearEnd: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adjustment-amount">
                              Miesięczne wynagrodzenie
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="adjustment-amount"
                                type="number"
                                value={newAdjustment.amount}
                                onChange={(e) =>
                                  setNewAdjustment({
                                    ...newAdjustment,
                                    amount: Number(e.target.value),
                                  })
                                }
                                className="flex-1"
                              />
                              <span className="text-muted-foreground text-sm">
                                zł
                              </span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddAdjustmentOpen(false)}
                          >
                            Anuluj
                          </Button>
                          <Button onClick={handleAddAdjustment}>
                            Dodaj Dostosowanie
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type="submit" disabled={isPending} className="mx-auto flex">
              {isPending
                ? "Zapisywanie..."
                : "Oblicz na zmienionych parametrach"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
