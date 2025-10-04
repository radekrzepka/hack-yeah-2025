import type { Logger } from "drizzle-orm/logger";
import chalk from "chalk";

import { LoggerService } from "../../../common/services/logger.service";

export class CustomDrizzleLogger implements Logger {
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService("SQL");
  }

  logQuery(query: string, params: Array<unknown>): void {
    const formattedQuery = this.formatQuery(query);
    const formattedParams = this.formatParams(params);

    this.logger.debug(`${formattedQuery}${formattedParams}`, {
      method: "logQuery",
      queryType: this.extractQueryType(query),
      paramCount: params.length,
    });
  }

  private formatQuery(query: string): string {
    const cleanQuery = query.replace(/\s+/g, " ").trim();

    return chalk.hex("#87CEEB")(cleanQuery);
  }

  private formatParams(params: Array<unknown>): string {
    if (params.length === 0) {
      return "";
    }

    const formattedParams = params.map((param) => {
      if (param === null) return chalk.hex("#808080")("null");
      if (param === undefined) return chalk.hex("#808080")("undefined");
      if (typeof param === "string") return chalk.hex("#90EE90")(`"${param}"`);
      if (typeof param === "number") return chalk.hex("#FFB6C1")(String(param));
      if (typeof param === "boolean")
        return chalk.hex("#DDA0DD")(String(param));
      if (param instanceof Date)
        return chalk.hex("#F0E68C")(param.toISOString());
      return chalk.hex("#FFA07A")(JSON.stringify(param));
    });

    return ` | ${chalk.hex("#666666")("Params:")} [${formattedParams.join(", ")}]`;
  }

  private extractQueryType(query: string): string {
    const upperQuery = query.toUpperCase().trim();
    if (upperQuery.startsWith("SELECT")) return "SELECT";
    if (upperQuery.startsWith("INSERT")) return "INSERT";
    if (upperQuery.startsWith("UPDATE")) return "UPDATE";
    if (upperQuery.startsWith("DELETE")) return "DELETE";
    if (upperQuery.startsWith("CREATE")) return "CREATE";
    if (upperQuery.startsWith("ALTER")) return "ALTER";
    if (upperQuery.startsWith("DROP")) return "DROP";
    return "UNKNOWN";
  }
}
