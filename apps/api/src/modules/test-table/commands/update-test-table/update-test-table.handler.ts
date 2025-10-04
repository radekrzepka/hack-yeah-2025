import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { UpdateTestTableResponseDto } from "../../dtos/update-test-table/update-test-table-response.dto";
import {
  TestTableAlreadyExistsException,
  TestTableNotFoundException,
} from "../../exceptions/test-table.exceptions";
import { TestTableRepository } from "../../repositories/test-table.repository";
import { UpdateTestTableCommand } from "./update-test-table.command";

@CommandHandler(UpdateTestTableCommand)
export class UpdateTestTableHandler
  implements ICommandHandler<UpdateTestTableCommand>
{
  private readonly logger: LoggerService;

  constructor(private readonly testTableRepository: TestTableRepository) {
    this.logger = new LoggerService(UpdateTestTableHandler.name);
  }

  async execute(
    command: UpdateTestTableCommand,
  ): Promise<UpdateTestTableResponseDto> {
    const { id, email, firstName } = command;

    this.logger.logCommandStart("UpdateTestTableCommand", "execute", {
      id,
      email,
      firstName,
    });

    const existingRecord = await this.testTableRepository.findById(id);
    if (!existingRecord) {
      this.logger.logWarning(
        `Test table record not found for ID: ${id}`,
        "execute",
      );
      throw new TestTableNotFoundException();
    }

    if (email && email !== existingRecord.email) {
      const emailExists = await this.testTableRepository.findByEmail(email);
      if (emailExists) {
        this.logger.logWarning(
          `Test table record update failed: email already exists: ${email}`,
          "execute",
        );
        throw new TestTableAlreadyExistsException();
      }
    }

    await this.testTableRepository.update(id, {
      ...(email && { email }),
      ...(firstName && { firstName }),
    });

    const updatedRecord = await this.testTableRepository.findById(id);
    if (!updatedRecord) {
      throw new TestTableNotFoundException();
    }

    this.logger.logSuccess(
      `Test table record updated successfully with ID: ${id}`,
      "execute",
    );

    return new UpdateTestTableResponseDto(updatedRecord);
  }
}
