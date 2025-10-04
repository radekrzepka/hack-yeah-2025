import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { ApiServerErrorResponse } from "../../../common/decorators/api-server-error-response.decorator";
import { Public } from "../../../common/decorators/public.decorator";
import { CreateTestTableRequestDto } from "../dtos/create-test-table/create-test-table-request.dto";
import { CreateTestTableResponseDto } from "../dtos/create-test-table/create-test-table-response.dto";
import { DeleteTestTableResponseDto } from "../dtos/delete-test-table/delete-test-table-response.dto";
import { GetTestTableResponseDto } from "../dtos/get-test-table/get-test-table-response.dto";
import { UpdateTestTableRequestDto } from "../dtos/update-test-table/update-test-table-request.dto";
import { UpdateTestTableResponseDto } from "../dtos/update-test-table/update-test-table-response.dto";
import {
  TestTableAlreadyExistsException,
  TestTableCreationException,
  TestTableNotFoundException,
} from "../exceptions/test-table.exceptions";
import { TestTableService } from "../services/test-table.service";

@ApiTags("Test Table")
@Controller({ version: "1", path: "test-table" })
export class TestTableController {
  constructor(private readonly testTableService: TestTableService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: "Create a new test table record",
    description: "Creates a new test table record with email and first name",
  })
  @ApiBody({
    type: CreateTestTableRequestDto,
    required: true,
  })
  @ApiCreatedResponse({
    type: CreateTestTableResponseDto,
    description: "Test table record created successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid request format or validation errors.",
  })
  @ApiConflictResponse({
    description: "Test table record with this email already exists",
  })
  @ApiServerErrorResponse()
  async create(
    @Body() createDto: CreateTestTableRequestDto,
  ): Promise<CreateTestTableResponseDto> {
    try {
      return await this.testTableService.create(createDto);
    } catch (error: unknown) {
      if (error instanceof TestTableAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof TestTableCreationException) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: "Get all test table records",
    description: "Retrieves a list of all test table records",
  })
  @ApiOkResponse({
    type: GetTestTableResponseDto,
    description: "List of test table records retrieved successfully",
    isArray: true,
  })
  @ApiServerErrorResponse()
  async findAll(): Promise<Array<GetTestTableResponseDto>> {
    return await this.testTableService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "Get test table record by ID",
    description: "Retrieves a specific test table record by its ID",
  })
  @ApiParam({
    name: "id",
    description: "Test table record ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiOkResponse({
    type: GetTestTableResponseDto,
    description: "Test table record retrieved successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid UUID format",
  })
  @ApiNotFoundResponse({
    description: "Test table record not found",
  })
  @ApiServerErrorResponse()
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<GetTestTableResponseDto> {
    try {
      return await this.testTableService.findById(id);
    } catch (error: unknown) {
      if (error instanceof TestTableNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Public()
  @Put(":id")
  @ApiOperation({
    summary: "Update test table record",
    description: "Updates an existing test table record by its ID",
  })
  @ApiParam({
    name: "id",
    description: "Test table record ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiBody({
    type: UpdateTestTableRequestDto,
    required: true,
  })
  @ApiOkResponse({
    type: UpdateTestTableResponseDto,
    description: "Test table record updated successfully",
  })
  @ApiBadRequestResponse({
    description:
      "Invalid request format, validation errors, or invalid UUID format",
  })
  @ApiNotFoundResponse({
    description: "Test table record not found",
  })
  @ApiConflictResponse({
    description: "Test table record with this email already exists",
  })
  @ApiServerErrorResponse()
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTestTableRequestDto,
  ): Promise<UpdateTestTableResponseDto> {
    try {
      return await this.testTableService.update(id, updateDto);
    } catch (error: unknown) {
      if (error instanceof TestTableNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof TestTableAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Public()
  @Delete(":id")
  @ApiOperation({
    summary: "Delete test table record",
    description: "Deletes a test table record by its ID",
  })
  @ApiParam({
    name: "id",
    description: "Test table record ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiOkResponse({
    type: DeleteTestTableResponseDto,
    description: "Test table record deleted successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid UUID format",
  })
  @ApiNotFoundResponse({
    description: "Test table record not found",
  })
  @ApiServerErrorResponse()
  async delete(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<DeleteTestTableResponseDto> {
    try {
      return await this.testTableService.delete(id);
    } catch (error: unknown) {
      if (error instanceof TestTableNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
