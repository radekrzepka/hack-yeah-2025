"use client";

import { Button, Input, Label } from "@hackathon/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Form() {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      setError("Proszę wprowadzić kwotę");
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Proszę wprowadzić prawidłową kwotę");
      return;
    }
    setError("");
    router.push(`/form?target=${encodeURIComponent(amount)}`);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (error) setError("");
    }
  };

  return (
    <form
      id="form-section"
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-4 p-6"
      aria-labelledby="form-heading"
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="amount"
          id="form-heading"
          className="font-semibold text-gray-900"
        >
          Oczekiwana wysokość emerytury?
        </Label>
        <Input
          id="amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Wprowadź kwotę"
          className="focus:border-primary focus:ring-primary border-gray-300"
          aria-invalid={!!error}
          aria-describedby={error ? "amount-error" : undefined}
          required
        />
        {error && (
          <p
            id="amount-error"
            className="text-sm font-medium text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!amount || isNaN(Number(amount))}
      >
        Oblicz
      </Button>
    </form>
  );
}
