import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateTestTableCommand } from "../commands/create-test-table/create-test-table.command";
import { DeleteTestTableCommand } from "../commands/delete-test-table/delete-test-table.command";
import { UpdateTestTableCommand } from "../commands/update-test-table/update-test-table.command";
import { CreateTestTableRequestDto } from "../dtos/create-test-table/create-test-table-request.dto";
import { CreateTestTableResponseDto } from "../dtos/create-test-table/create-test-table-response.dto";
import { DeleteTestTableResponseDto } from "../dtos/delete-test-table/delete-test-table-response.dto";
import { GetTestTableResponseDto } from "../dtos/get-test-table/get-test-table-response.dto";
import { UpdateTestTableRequestDto } from "../dtos/update-test-table/update-test-table-request.dto";
import { UpdateTestTableResponseDto } from "../dtos/update-test-table/update-test-table-response.dto";
import { GetAllTestTablesQuery } from "../queries/get-all-test-tables/get-all-test-tables.query";
import { GetTestTableByIdQuery } from "../queries/get-test-table-by-id/get-test-table-by-id.query";

@Injectable()
export class TestTableService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    dto: CreateTestTableRequestDto,
  ): Promise<CreateTestTableResponseDto> {
    const command = new CreateTestTableCommand(dto.email, dto.firstName);
    return this.commandBus.execute(command);
  }

  async findById(id: string): Promise<GetTestTableResponseDto> {
    const query = new GetTestTableByIdQuery(id);
    return this.queryBus.execute(query);
  }

  async findAll(): Promise<Array<GetTestTableResponseDto>> {
    const query = new GetAllTestTablesQuery();
    return this.queryBus.execute(query);
  }

  async update(
    id: string,
    dto: UpdateTestTableRequestDto,
  ): Promise<UpdateTestTableResponseDto> {
    const command = new UpdateTestTableCommand(id, dto.email, dto.firstName);
    return this.commandBus.execute(command);
  }

  async delete(id: string): Promise<DeleteTestTableResponseDto> {
    const command = new DeleteTestTableCommand(id);
    return this.commandBus.execute(command);
  }
}
