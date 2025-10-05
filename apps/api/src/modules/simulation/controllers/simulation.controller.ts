import {
  Body,
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";

import { ApiServerErrorResponse } from "../../../common/decorators/api-server-error-response.decorator";
import { Public } from "../../../common/decorators/public.decorator";
import { GetSimulationResultResponseDto } from "../dtos/get-simulation-result/get-simulation-result-response.dto";
import { SendSimulationRequestDto } from "../dtos/send-simulation/send-simulation-request.dto";
import { SendSimulationResponseDto } from "../dtos/send-simulation/send-simulation-response.dto";
import {
  SimulationCreationException,
  SimulationNotFoundException,
} from "../exceptions/simulation.exceptions";
import { PdfGeneratorService } from "../services/pdf-generator.service";
import { SimulationService } from "../services/simulation.service";

@ApiTags("Simulation")
@Controller({ version: "1", path: "simulation" })
export class SimulationController {
  constructor(
    private readonly simulationService: SimulationService,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  @Public()
  @Post("send")
  @ApiOperation({
    summary: "Send simulation request",
    description:
      "Creates a new simulation request and returns a unique token ID",
  })
  @ApiBody({
    type: SendSimulationRequestDto,
    required: true,
  })
  @ApiCreatedResponse({
    type: SendSimulationResponseDto,
    description: "Simulation request created successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid request format or validation errors.",
  })
  @ApiServerErrorResponse()
  async sendSimulation(
    @Body() sendDto: SendSimulationRequestDto,
  ): Promise<SendSimulationResponseDto> {
    try {
      return await this.simulationService.sendSimulation(sendDto);
    } catch (error: unknown) {
      if (error instanceof SimulationCreationException) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Public()
  @Get(":tokenId")
  @ApiOperation({
    summary: "Get simulation result by token ID",
    description: "Retrieves the simulation result using the token ID",
  })
  @ApiParam({
    name: "tokenId",
    description: "Simulation token ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiOkResponse({
    type: GetSimulationResultResponseDto,
    description: "Simulation result retrieved successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid UUID format",
  })
  @ApiNotFoundResponse({
    description: "Simulation not found",
  })
  @ApiServerErrorResponse()
  async getSimulationResult(
    @Param("tokenId", ParseUUIDPipe) tokenId: string,
  ): Promise<GetSimulationResultResponseDto> {
    try {
      return await this.simulationService.getSimulationResult(tokenId);
    } catch (error: unknown) {
      if (error instanceof SimulationNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Public()
  @Get(":tokenId/report")
  @Header("Content-Type", "application/pdf")
  @ApiOperation({
    summary: "Generate PDF report for simulation",
    description:
      "Generates a PDF report for the simulation result based on the dashboard view",
  })
  @ApiParam({
    name: "tokenId",
    description: "Simulation token ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiOkResponse({
    description: "PDF report generated successfully",
    content: {
      "application/pdf": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid UUID format",
  })
  @ApiNotFoundResponse({
    description: "Simulation not found",
  })
  @ApiServerErrorResponse()
  async generateReport(
    @Param("tokenId", ParseUUIDPipe) tokenId: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.simulationService.getSimulationResult(tokenId);
      const pdfBuffer = await this.pdfGeneratorService.generatePensionReport({
        tokenId,
      });
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="pension-report-${tokenId}.pdf"`,
      );
      response.setHeader("Content-Type", "application/pdf");
      response.setHeader("Content-Length", pdfBuffer.length);
      response.send(pdfBuffer);
    } catch (error: unknown) {
      if (error instanceof SimulationNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException("Failed to generate PDF report");
    }
  }
}
