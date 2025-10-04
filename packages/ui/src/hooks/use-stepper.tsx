"use client";

import { useState } from "react";

export function useStepper(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    isFirstStep,
    isLastStep,
  };
}
