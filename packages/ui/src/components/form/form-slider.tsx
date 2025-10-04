"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface FormSliderProps
  extends React.ComponentPropsWithoutRef<typeof Slider> {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormSlider: React.FC<FormSliderProps> = ({
  name,
  label,
  disabled,
  required,
  ...props
}) => {
  const {
    control,
    formState: { errors, touchedFields },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={props.defaultValue ?? [0]}
        render={({ field }) => (
          <Slider
            {...props}
            {...field}
            value={[field.value]}
            onValueChange={(vals) => field.onChange(vals[0])}
            disabled={disabled}
          />
        )}
      />
      {touchedFields[name] && typeof error === "string" ? (
        <div className="mt-1 flex gap-1 text-sm text-red-500">{error}</div>
      ) : null}
    </div>
  );
};
