import type { Response } from "express";
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { ApiServerErrorResponse } from "../../../common/decorators/api-server-error-response.decorator";
import { Public } from "../../../common/decorators/public.decorator";
import { GetAllSimulationResultsResponseDto } from "../dtos/get-all-simulation-results/get-all-simulation-results-response.dto";
import { LoginRequestDto } from "../dtos/login/login-request.dto";
import { LoginResponseDto } from "../dtos/login/login-response.dto";
import {
  AdminNotFoundException,
  InvalidCredentialsException,
} from "../exceptions/admin.exceptions";
import { AdminService } from "../services/admin.service";

@ApiTags("Admin")
@Controller({ version: "1", path: "admin" })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post("login")
  @ApiOperation({
    summary: "Admin login",
    description: "Authenticates admin user and returns JWT token",
  })
  @ApiBody({
    type: LoginRequestDto,
    required: true,
  })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: "Login successful, JWT token returned",
  })
  @ApiBadRequestResponse({
    description: "Invalid request format or validation errors.",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
  })
  @ApiServerErrorResponse()
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      return await this.adminService.login(loginDto);
    } catch (error: unknown) {
      if (
        error instanceof AdminNotFoundException ||
        error instanceof InvalidCredentialsException
      ) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Get("data")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all simulation results (Admin only)",
    description:
      "Retrieves all simulation results data. Requires admin JWT token in Authorization header.",
  })
  @ApiOkResponse({
    type: GetAllSimulationResultsResponseDto,
    description: "List of simulation results retrieved successfully",
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiServerErrorResponse()
  async getAllData(): Promise<Array<GetAllSimulationResultsResponseDto>> {
    return await this.adminService.getAllData();
  }

  @Get("data/export")
  @ApiBearerAuth()
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  )
  @ApiOperation({
    summary: "Export all simulation results as XLSX (Admin only)",
    description:
      "Downloads all simulation results data as an Excel file. Requires admin JWT token in Authorization header.",
  })
  @ApiOkResponse({
    description: "XLSX file with simulation results downloaded successfully",
    schema: {
      type: "string",
      format: "binary",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiServerErrorResponse()
  async exportDataAsXlsx(@Res() res: Response): Promise<void> {
    const buffer = await this.adminService.getAllDataAsXlsx();
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `wyniki-symulacji-${timestamp}.xlsx`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  }
}
