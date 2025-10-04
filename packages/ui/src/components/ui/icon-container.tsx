import * as React from "react";
import { cn } from "../../lib/utils";

interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  iconSize?: "sm" | "md" | "lg";
}

export function IconContainer({
  icon,
  size = "md",
  iconSize = "md",
  className,
  ...props
}: IconContainerProps) {
  const containerSizes = {
    sm: "h-16 w-16 p-3",
    md: "h-24 w-24 p-4",
    lg: "h-32 w-32 p-5",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "bg-primary/10 flex items-center justify-center rounded-full",
        containerSizes[size],
        className,
      )}
      {...props}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: cn("text-primary", iconSizes[iconSize]),
            strokeWidth: 1.5,
          })
        : icon}
    </div>
  );
}
