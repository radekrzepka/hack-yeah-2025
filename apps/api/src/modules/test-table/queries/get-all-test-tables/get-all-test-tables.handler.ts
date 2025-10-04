import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { GetTestTableResponseDto } from "../../dtos/get-test-table/get-test-table-response.dto";
import { TestTableRepository } from "../../repositories/test-table.repository";
import { GetAllTestTablesQuery } from "./get-all-test-tables.query";

@QueryHandler(GetAllTestTablesQuery)
export class GetAllTestTablesHandler
  implements IQueryHandler<GetAllTestTablesQuery>
{
  private readonly logger: LoggerService;

  constructor(private readonly testTableRepository: TestTableRepository) {
    this.logger = new LoggerService(GetAllTestTablesHandler.name);
  }

  async execute(): Promise<Array<GetTestTableResponseDto>> {
    this.logger.log("Finding all test table records", { method: "execute" });

    const records = await this.testTableRepository.findAll();

    this.logger.log(`Found ${records.length} test table records`, {
      method: "execute",
    });

    return records.map((record) => new GetTestTableResponseDto(record));
  }
}
