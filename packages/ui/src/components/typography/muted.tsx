import { cn } from "../../lib/utils";
import type { TypographyProps } from "./props";

export function TypographyMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
}
