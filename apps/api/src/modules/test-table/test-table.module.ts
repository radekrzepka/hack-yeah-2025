import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateTestTableHandler } from "./commands/create-test-table/create-test-table.handler";
import { DeleteTestTableHandler } from "./commands/delete-test-table/delete-test-table.handler";
import { UpdateTestTableHandler } from "./commands/update-test-table/update-test-table.handler";
import { TestTableController } from "./controllers/test-table.controller";
import { GetAllTestTablesHandler } from "./queries/get-all-test-tables/get-all-test-tables.handler";
import { GetTestTableByIdHandler } from "./queries/get-test-table-by-id/get-test-table-by-id.handler";
import { TestTableRepository } from "./repositories/test-table.repository";
import { TestTableService } from "./services/test-table.service";

const TestTableCommandHandlers = [
  CreateTestTableHandler,
  DeleteTestTableHandler,
  UpdateTestTableHandler,
];

const TestTableQueryHandlers = [
  GetAllTestTablesHandler,
  GetTestTableByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [TestTableController],
  providers: [
    ...TestTableCommandHandlers,
    ...TestTableQueryHandlers,
    TestTableService,
    TestTableRepository,
  ],
  exports: [TestTableService, TestTableRepository],
})
export class TestTableModule {}
