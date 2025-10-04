import type { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { createParamDecorator } from "@nestjs/common";

interface AdminPayload {
  sub: string;
  login: string;
  iat?: number;
  exp?: number;
}

interface RequestWithAdmin extends Request {
  admin?: AdminPayload;
}

export const Admin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithAdmin>();
    return request.admin;
  },
);
