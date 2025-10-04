import type { Request } from "express";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

interface AdminPayload {
  sub: string;
  login: string;
  iat?: number;
  exp?: number;
}

interface RequestWithAdmin extends Request {
  admin?: AdminPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("No authorization token provided");
    }
    try {
      const payload = await this.jwtService.verifyAsync<AdminPayload>(token, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });
      request.admin = payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
