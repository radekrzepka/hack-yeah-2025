import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { CreateTestTableResponseDto } from "../../dtos/create-test-table/create-test-table-response.dto";
import {
  TestTableAlreadyExistsException,
  TestTableCreationException,
} from "../../exceptions/test-table.exceptions";
import { TestTableRepository } from "../../repositories/test-table.repository";
import { CreateTestTableCommand } from "./create-test-table.command";

@CommandHandler(CreateTestTableCommand)
export class CreateTestTableHandler
  implements ICommandHandler<CreateTestTableCommand>
{
  private readonly logger: LoggerService;

  constructor(private readonly testTableRepository: TestTableRepository) {
    this.logger = new LoggerService(CreateTestTableHandler.name);
  }

  async execute(
    command: CreateTestTableCommand,
  ): Promise<CreateTestTableResponseDto> {
    const { email, firstName } = command;

    this.logger.logCommandStart("CreateTestTableCommand", "execute", {
      email,
      firstName,
    });

    const existingRecord = await this.testTableRepository.findByEmail(email);
    if (existingRecord) {
      this.logger.logWarning(
        `Test table record creation failed: email already exists: ${email}`,
        "execute",
      );
      throw new TestTableAlreadyExistsException();
    }

    const createdRecord = await this.testTableRepository.create({
      email,
      firstName,
    });

    if (!createdRecord) {
      this.logger.logFailure(
        "Test table record creation failed",
        new Error("Record creation failed"),
        "execute",
        { email },
      );
      throw new TestTableCreationException();
    }

    this.logger.logSuccess(
      `Test table record created successfully with ID: ${createdRecord.id}`,
      "execute",
    );

    return new CreateTestTableResponseDto(createdRecord);
  }
}
