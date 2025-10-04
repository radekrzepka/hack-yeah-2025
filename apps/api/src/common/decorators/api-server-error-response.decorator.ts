import { applyDecorators } from "@nestjs/common";
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";

export function ApiServerErrorResponse(
  description = "An unexpected error occurred. This might be due to a network issue or an internal server problem.",
) {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description,
    }),
  );
}
