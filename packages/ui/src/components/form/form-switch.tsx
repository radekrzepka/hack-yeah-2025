"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface FormSwitchProps
  extends React.ComponentPropsWithoutRef<typeof Switch> {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
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
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              {...props}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              checked={value}
              onCheckedChange={onChange}
              disabled={disabled}
            />
          )}
        />
        {label && (
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
        )}
      </div>
      {touchedFields[name] && typeof error === "string" ? (
        <div className="mt-1 flex gap-1 text-sm text-red-500">{error}</div>
      ) : null}
    </div>
  );
};
