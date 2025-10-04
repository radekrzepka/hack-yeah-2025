"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface FormPasswordInputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormPasswordInput: React.FunctionComponent<
  FormPasswordInputProps
> = ({ name, label, placeholder, disabled, required, ...inputProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div>
      {label && (
        <Label htmlFor={name} className="mb-3 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          {...register(name)}
          {...inputProps}
          id={name}
          type={showPassword ? "text " : "password"}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      {touchedFields[name] && typeof error === "string" ? (
        <div className="mt-1 flex gap-1 text-sm text-red-500">{error}</div>
      ) : null}
    </div>
  );
};
