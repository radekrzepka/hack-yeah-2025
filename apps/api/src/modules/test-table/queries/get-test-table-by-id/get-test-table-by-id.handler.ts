import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { GetTestTableResponseDto } from "../../dtos/get-test-table/get-test-table-response.dto";
import { TestTableNotFoundException } from "../../exceptions/test-table.exceptions";
import { TestTableRepository } from "../../repositories/test-table.repository";
import { GetTestTableByIdQuery } from "./get-test-table-by-id.query";

@QueryHandler(GetTestTableByIdQuery)
export class GetTestTableByIdHandler
  implements IQueryHandler<GetTestTableByIdQuery>
{
  private readonly logger: LoggerService;

  constructor(private readonly testTableRepository: TestTableRepository) {
    this.logger = new LoggerService(GetTestTableByIdHandler.name);
  }

  async execute(
    query: GetTestTableByIdQuery,
  ): Promise<GetTestTableResponseDto> {
    const { id } = query;

    this.logger.log(`Finding test table record by ID: ${id}`, {
      method: "execute",
    });

    const record = await this.testTableRepository.findById(id);
    if (!record) {
      this.logger.logWarning(
        `Test table record not found for ID: ${id}`,
        "execute",
      );
      throw new TestTableNotFoundException();
    }

    this.logger.log(`Test table record found with ID: ${id}`, {
      method: "execute",
    });

    return new GetTestTableResponseDto(record);
  }
}
