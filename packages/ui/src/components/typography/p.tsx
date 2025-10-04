import { cn } from "../../lib/utils";
import type { TypographyProps } from "./props";

export function TypographyP({ children, className }: TypographyProps) {
  return <p className={cn("leading-7", className)}>{children}</p>;
}
