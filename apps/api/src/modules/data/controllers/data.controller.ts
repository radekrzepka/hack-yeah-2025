import { Controller, Get } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { Public } from "../../../common/decorators/public.decorator";
import { ApiServerErrorResponse } from "../../../common/decorators/api-server-error-response.decorator";
import { GetLandingPageDataResponseDto } from "../dtos/get-landing-page-data-response.dto";
import { DataService } from "../services/data.service";

@ApiTags("Data")
@Controller({ version: "1", path: "data" })
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Public()
  @Get("landing-page-data")
  @ApiOperation({
    summary: "Get landing page data",
    description: "Retrieves all facts and charts data for the landing page",
  })
  @ApiOkResponse({
    type: GetLandingPageDataResponseDto,
    description: "Landing page data retrieved successfully",
  })
  @ApiServerErrorResponse()
  async getLandingPageData(): Promise<GetLandingPageDataResponseDto> {
    return await this.dataService.getLandingPageData();
  }
}
