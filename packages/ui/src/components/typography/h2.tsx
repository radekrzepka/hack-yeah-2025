import { cn } from "../../lib/utils";
import type { TypographyProps } from "./props";

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 md:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
