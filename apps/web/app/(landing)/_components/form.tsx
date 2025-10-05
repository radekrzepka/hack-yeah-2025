"use client";

import { Button, Input, Label } from "@hackathon/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Form() {
  const [amount, setAmount] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount))) {
      return;
    }

    // Route to /form with the amount as a URL parameter
    router.push(`/form?target=${encodeURIComponent(amount)}`);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <form id="form-section" onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Oczekiwana wysokość emerytury?</Label>
        <Input
          id="amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Wprowadź kwotę"
          className="border-gray-300 focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <Button
        type="submit"
        className="bg-primary text-white hover:bg-primary/90 p-3"
        disabled={!amount || isNaN(Number(amount))}
      >
        Oblicz
      </Button>
    </form>
  );
}