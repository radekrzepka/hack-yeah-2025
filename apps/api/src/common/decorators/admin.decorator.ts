import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

export const Admin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.admin;
  },
);
