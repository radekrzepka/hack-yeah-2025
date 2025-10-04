"use client";

interface StepperProps {
  steps: Array<string>;
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex flex-col items-center ${
            index <= currentStep
              ? "text-primary-foreground"
              : "text-card-foreground"
          }`}
        >
          <div
            className={`border-border h-8 w-8 rounded-full border ${
              index <= currentStep ? "bg-primary" : "bg-card"
            } mb-2 flex items-center justify-center`}
          >
            {index + 1}
          </div>
          <span className="text-foreground text-center text-[10px] md:text-xs">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
