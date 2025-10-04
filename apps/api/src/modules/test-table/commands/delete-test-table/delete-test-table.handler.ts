import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { DeleteTestTableResponseDto } from "../../dtos/delete-test-table/delete-test-table-response.dto";
import { TestTableNotFoundException } from "../../exceptions/test-table.exceptions";
import { TestTableRepository } from "../../repositories/test-table.repository";
import { DeleteTestTableCommand } from "./delete-test-table.command";

@CommandHandler(DeleteTestTableCommand)
export class DeleteTestTableHandler
  implements ICommandHandler<DeleteTestTableCommand>
{
  private readonly logger: LoggerService;

  constructor(private readonly testTableRepository: TestTableRepository) {
    this.logger = new LoggerService(DeleteTestTableHandler.name);
  }

  async execute(
    command: DeleteTestTableCommand,
  ): Promise<DeleteTestTableResponseDto> {
    const { id } = command;

    this.logger.logCommandStart("DeleteTestTableCommand", "execute", { id });

    const existingRecord = await this.testTableRepository.findById(id);
    if (!existingRecord) {
      this.logger.logWarning(
        `Test table record not found for ID: ${id}`,
        "execute",
      );
      throw new TestTableNotFoundException();
    }

    await this.testTableRepository.delete(id);

    this.logger.logSuccess(
      `Test table record deleted successfully with ID: ${id}`,
      "execute",
    );

    return new DeleteTestTableResponseDto(
      true,
      "Test table record deleted successfully",
    );
  }
}
