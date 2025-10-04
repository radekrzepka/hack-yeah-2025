import { ConsoleLogger, Injectable } from "@nestjs/common";
import chalk from "chalk";

chalk.level = 3;

interface LogContext {
  context?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly isCI: boolean;
  private readonly isTest: boolean;

  constructor(context: string) {
    super(context);
    this.isCI = process.env.CI === "true";
    this.isTest =
      process.env.NODE_ENV === "test" ||
      process.env.JEST_WORKER_ID !== undefined;
  }

  override log(message: string, contextOrMethod?: string | LogContext): void {
    if (this.isCI || this.isTest) return;
    const formattedMessage = this.formatMessage(message, contextOrMethod);
    console.log(chalk.hex("#00ff00")(`[LOG] ${formattedMessage}`));
  }

  override error(
    message: string,
    traceOrContext?: string | LogContext,
    context?: string | LogContext,
  ): void {
    if (this.isCI || this.isTest) return;
    let trace: string | undefined;
    let logContext: string | LogContext | undefined;

    if (typeof traceOrContext === "string" && typeof context !== "undefined") {
      trace = traceOrContext;
      logContext = context;
    } else {
      logContext = traceOrContext;
    }

    const formattedMessage = this.formatMessage(message, logContext);
    const errorMessage = trace
      ? `${formattedMessage}\n${chalk.gray("Trace:")} ${trace}`
      : formattedMessage;
    console.error(chalk.hex("#ff0000")(`[ERROR] ${errorMessage}`));
  }

  override warn(message: string, contextOrMethod?: string | LogContext): void {
    if (this.isCI || this.isTest) return;
    const formattedMessage = this.formatMessage(message, contextOrMethod);
    console.warn(chalk.hex("#ffff00")(`[WARN] ${formattedMessage}`));
  }

  override debug(message: string, contextOrMethod?: string | LogContext): void {
    if (this.isCI || this.isTest) return;
    const formattedMessage = this.formatMessage(message, contextOrMethod);
    console.debug(chalk.hex("#0088ff")(`[DEBUG] ${formattedMessage}`));
  }

  override verbose(
    message: string,
    contextOrMethod?: string | LogContext,
  ): void {
    if (this.isCI || this.isTest) return;
    const formattedMessage = this.formatMessage(message, contextOrMethod);
    console.log(chalk.hex("#ff00ff")(`[VERBOSE] ${formattedMessage}`));
  }

  override fatal(message: string, contextOrMethod?: string | LogContext): void {
    if (this.isCI || this.isTest) return;
    const formattedMessage = this.formatMessage(message, contextOrMethod);
    console.error(chalk.hex("#ff0000").bold(`[FATAL] ${formattedMessage}`));
  }

  logCommandStart(
    commandName: string,
    method: string = "execute",
    additionalContext?: LogContext,
  ): void {
    const contextData: LogContext = {
      method,
      commandType: "command",
      ...additionalContext,
    };
    this.log(`Starting execution of ${commandName}`, contextData);
  }

  logSuccess(
    message: string,
    method: string = "execute",
    additionalContext?: LogContext,
  ): void {
    const contextData: LogContext = {
      method,
      status: "success",
      ...additionalContext,
    };
    this.log(chalk.green.bold(`✓ ${message}`), contextData);
  }

  logFailure(
    message: string,
    error: Error,
    method: string = "execute",
    additionalContext?: LogContext,
  ): void {
    const contextData: LogContext = {
      method,
      status: "failure",
      errorName: error.name,
      ...additionalContext,
    };
    this.error(chalk.red.bold(`✗ ${message}`), error.stack, contextData);
  }

  logWarning(
    message: string,
    method: string = "execute",
    additionalContext?: LogContext,
  ): void {
    const contextData: LogContext = {
      method,
      ...additionalContext,
    };
    this.warn(chalk.yellow.bold(`⚠ ${message}`), contextData);
  }

  logDebug(
    message: string,
    method: string = "execute",
    additionalContext?: LogContext,
  ): void {
    const contextData: LogContext = {
      method,
      ...additionalContext,
    };
    this.debug(`${message}`, contextData);
  }

  protected override formatMessage(
    message: string,
    contextOrMethod?: string | LogContext,
  ): string {
    const timestamp = chalk.hex("#808080")(new Date().toISOString());
    let contextString = "";

    if (typeof contextOrMethod === "string") {
      contextString = chalk.hex("#00ffff")(
        `[${this.context}:${contextOrMethod}]`,
      );
    } else if (
      typeof contextOrMethod === "object" &&
      contextOrMethod !== null
    ) {
      const { context, method, ...additionalData } = contextOrMethod;
      const actualContext = context || this.context;
      const methodPart = method ? `:${method}` : "";
      contextString = chalk.hex("#00ffff")(`[${actualContext}${methodPart}]`);

      const additionalEntries = Object.entries(additionalData).filter(
        ([, value]) => value !== undefined,
      );
      if (additionalEntries.length > 0) {
        const additionalContext = additionalEntries
          .map(
            ([key, value]) =>
              `${chalk.hex("#666666")(key)}=${chalk.hex("#ffffff")(String(value))}`,
          )
          .join(", ");
        contextString += ` ${chalk.hex("#666666")("{")}${additionalContext}${chalk.hex("#666666")("}")}`;
      }
    } else {
      contextString = chalk.hex("#00ffff")(`[${this.context}]`);
    }

    return `${timestamp} ${contextString} ${message}`;
  }
}
