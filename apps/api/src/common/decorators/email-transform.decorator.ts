import { Transform } from "class-transformer";

export function EmailTransform() {
  return Transform(({ value }: { value: string }) => {
    if (typeof value === "string") {
      return value.toLowerCase().trim();
    }
    return value;
  });
}
