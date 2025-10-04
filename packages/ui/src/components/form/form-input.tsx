"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface FormInputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "tel";
  disabled?: boolean;
  required?: boolean;
}

export const FormInput: React.FunctionComponent<FormInputProps> = ({
  name,
  label,
  placeholder,
  disabled,
  required,
  type,
  ...inputProps
}) => {
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
      <div>
        <Input
          {...register(name)}
          {...inputProps}
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {touchedFields[name] && typeof error === "string" ? (
        <div className="mt-1 flex gap-1 text-sm text-red-500">{error}</div>
      ) : null}
    </div>
  );
};
