import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    if (process?.env?.IS_LOCAL !== "true") return next();

    const { method, originalUrl } = req;
    const startTime = Date.now();

    if (method == "OPTIONS") return next();

    this.logger.log(
      `[${process.env.PORT}] Incoming Request: ${method} ${originalUrl}`,
    );

    res.on("finish", () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      this.logger.log(
        `[${process.env.PORT}] Outgoing Response: ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`,
      );
    });

    next();
  }
}
